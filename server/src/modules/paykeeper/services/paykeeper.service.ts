import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PaykeeperService {
  private readonly secretSeed: string;
  private readonly duckPrice: number;

  private buildOkResponse(paymentId: string): string {
    const hash = crypto.createHash('md5').update(paymentId + this.secretSeed).digest('hex');
    return `OK ${hash}`;
  }

  constructor(private prisma: PrismaService) {
    const secretSeed = process.env.PAYKEEPER_SECRET_SEED;
    const duckPriceStr = process.env.DUCK_PRICE;

    if (!secretSeed) {
      throw new Error('PAYKEEPER_SECRET_SEED must be set');
    }
    if (!duckPriceStr) {
      throw new Error('DUCK_PRICE must be set');
    }

    this.secretSeed = secretSeed;
    this.duckPrice = parseFloat(duckPriceStr);

    if (isNaN(this.duckPrice)) {
      throw new Error('DUCK_PRICE must be a valid number');
    }
  }

  async process(payload: any): Promise<string> {
    const { id, sum, orderid, clientid, key } = payload;

    // 1. Проверка подписи
    const formattedSum = parseFloat(sum).toFixed(2);
    const expectedKey = crypto
      .createHash('md5')
      .update(`${id}${formattedSum}${clientid || ''}${orderid || ''}${this.secretSeed}`)
      .digest('hex');

    if (key !== expectedKey) return 'ERROR';

    if (!orderid) return 'ERROR';

    const user = await this.prisma.user.findUnique({
      where: { verificationCode: orderid },
    });

    if (!user) return 'ERROR';

    // 3. Если уже оплачено — подтверждаем, но не обновляем
    if (user.paid) {
      return this.buildOkResponse(id);
    }

    // 4. Проверяем сумму: должна быть = ducks * DUCK_PRICE
    const expectedSum = user.ducks * this.duckPrice;
    if (Math.abs(parseFloat(formattedSum) - expectedSum) > 0.01) {
      return 'ERROR';
    }

    // 5. Устанавливаем paid = true
    await this.prisma.user.update({
      where: { id: user.id },
      data: { paid: true },
    });

    return this.buildOkResponse(id);
  }
}