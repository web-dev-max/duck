import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SmsService } from '../sms/services/sms.service';

@Module({
    controllers: [UserController],
    providers: [UserService, SmsService],
    exports: [UserService],
})
export class UserModule {}
