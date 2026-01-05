import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SmsModule } from '../sms/sms.module';

@Module({
    imports: [SmsModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
