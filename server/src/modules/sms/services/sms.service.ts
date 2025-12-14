import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface SendSmsResponse {
  status: number;
  message_id?: string;
  error_message?: string;
}

@Injectable()
export class SmsService {
  private apiKey = process.env.SMS_API_KEY || 'YOUR_SMS_API_KEY';

  async sendVerificationCode(phoneNumber: string, code: string): Promise<SendSmsResponse> {
    try {
      const response = await axios.post(
        'https://sms.ru/sms/send',
        {},
        {
          params: {
            to: phoneNumber,
            text: `Ваш проверочный код: ${code}`,
            json: 1,
            api_id: this.apiKey,
          },
        },
      );

      console.log(response.data); // TODO: УДАЛИТЬ ПОСЛЕ ПРОВЕРОК
      return response.data as SendSmsResponse;
    } catch (err) {
      console.error(err.response?.data || err.message);
      return { status: 500, error_message: err.response?.data };
    }
  }
}