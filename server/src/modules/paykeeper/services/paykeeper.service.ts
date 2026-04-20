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
    
    console.log('[SERVICE] Initialized with duckPrice:', this.duckPrice);
  }

  async process(payload: any): Promise<string> {
    console.log('[SERVICE] 1. process() started');
    console.log('[SERVICE] 2. Full payload:', JSON.stringify(payload, null, 2));
    
    const { id, sum, orderid, clientid, key } = payload;
    
    console.log('[SERVICE] 3. Extracted fields:', { id, sum, orderid, clientid, key: key?.substring(0, 10) + '...' });

    const formattedSum = parseFloat(sum).toFixed(2);
    const expectedKey = crypto
      .createHash('md5')
      .update(`${id}${formattedSum}${clientid || ''}${orderid || ''}${this.secretSeed}`)
      .digest('hex');

    console.log('[SERVICE] 4. Signature check:', {
      formattedSum,
      expectedKey,
      receivedKey: key,
      match: key === expectedKey
    });

    if (key !== expectedKey) {
      console.error('[SERVICE] 5. Signature mismatch - returning ERROR');
      return 'ERROR';
    }

    if (!orderid) {
      console.error('[SERVICE] 6. Missing orderid - returning ERROR');
      return 'ERROR';
    }

    console.log('[SERVICE] 7. Looking for user with verificationCode:', orderid, '(type:', typeof orderid, ')');

    const user = await this.prisma.user.findUnique({
      where: { verificationCode: String(orderid) },
    });

    if (!user) {
      console.error('[SERVICE] 8. User NOT found for verificationCode:', orderid);
      return 'ERROR';
    }

    console.log('[SERVICE] 9. User found:', {
      id: user.id,
      email: user.email,
      paid: user.paid,
      ducks: user.ducks,
      verificationCode: user.verificationCode
    });
    
    if (user.paid) {
      console.log('[SERVICE] 10. User already paid - returning OK');
      return this.buildOkResponse(id);
    }

    const ducksCount = typeof user.ducks === 'string' ? parseFloat(user.ducks) : user.ducks;
    const expectedSum = ducksCount * this.duckPrice;
    const actualSum = parseFloat(formattedSum);

    console.log('[SERVICE] 11. Amount check:', {
      ducksCount,
      duckPrice: this.duckPrice,
      expectedSum,
      actualSum,
      difference: Math.abs(actualSum - expectedSum)
    });

    if (Math.abs(actualSum - expectedSum) > 0.01) {
      console.error('[SERVICE] 12. Amount mismatch - returning ERROR');
      return 'ERROR';
    }

    console.log('[SERVICE] 13. Updating user paid to true...');
    
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { paid: true },
      });
      console.log('[SERVICE] 14. User updated successfully:', {
        id: updatedUser.id,
        paid: updatedUser.paid
      });
    } catch (error) {
      console.error('[SERVICE] 15. Error updating user:', error);
      return 'ERROR';
    }

    console.log('[SERVICE] 16. Returning OK response');
    return this.buildOkResponse(id);
  }
}