import { Body, Controller, Post } from '@nestjs/common';
import { PaykeeperService } from '../services/paykeeper.service';

@Controller('paykeeper')
export class PaykeeperController {
  constructor(private paykeeperService: PaykeeperService) {}

  @Post()
  async handle(@Body() body: any): Promise<string> {
    try {
      return await this.paykeeperService.process(body);
    } catch (e) {
      return 'ERROR';
    }
  }
}