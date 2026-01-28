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

    const formattedSum = parseFloat(sum).toFixed(2);
    const expectedKey = crypto
      .createHash('md5')
      .update(`${id}${formattedSum}${clientid || ''}${orderid || ''}${this.secretSeed}`)
      .digest('hex');

    if (key !== expectedKey) {
      console.error('Signature mismatch:', { key, expectedKey });
      return 'ERROR';
    }

    if (!orderid) {
      console.error('Missing orderid');
      return 'ERROR';
    }

    const user = await this.prisma.user.findUnique({
      where: { verificationCode: orderid },
    });

    if (!user) {
      console.error('User not found with verificationCode:', orderid);
      return 'ERROR';
    }

    console.log('Found user:', user);
    
    if (user.paid) {
      console.log('User already paid:', user.id);
      return this.buildOkResponse(id);
    }

    const ducksCount = typeof user.ducks === 'string' ? parseFloat(user.ducks) : user.ducks;
    const expectedSum = ducksCount * this.duckPrice;
    const actualSum = parseFloat(formattedSum);

    if (Math.abs(actualSum - expectedSum) > 0.01) return 'ERROR';

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { paid: true },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return 'ERROR';
    }

    return this.buildOkResponse(id);
  }
}