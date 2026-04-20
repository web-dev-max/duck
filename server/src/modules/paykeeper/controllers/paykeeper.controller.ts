import { Body, Controller, Post } from '@nestjs/common';
import { PaykeeperService } from '../services/paykeeper.service';

@Controller('paykeeper')
export class PaykeeperController {
  constructor(private paykeeperService: PaykeeperService) {}

  @Post()
  async handle(@Body() body: any): Promise<string> {
    console.log('[CONTROLLER] 1. Webhook received at /paykeeper');
    console.log('[CONTROLLER] 2. Body:', JSON.stringify(body, null, 2));
    
    try {
      const result = await this.paykeeperService.process(body);
      console.log('[CONTROLLER] 3. Service returned:', result);
      return result;
    } catch (e) {
      console.error('[CONTROLLER] 4. Error:', e.message);
      return 'ERROR';
    }
  }
}