import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { SmsController } from './controllers/sms.controller';


@Module({
    controllers: [SmsController],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule {}
