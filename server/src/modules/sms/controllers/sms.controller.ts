import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from '../services/sms.service';

interface SendSmsDto {
  phoneNumber: string;
  verificationCode: string;
}


// TODO: УДАЛИТЬ ПОСЛЕ ИНТЕГРАЦИИ ПЛАТЕЖА
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/send-code')
  async sendVerificationCode(@Body() dto: SendSmsDto) {
    return this.smsService.sendVerificationCode(dto.phoneNumber, dto.verificationCode);
  }
}