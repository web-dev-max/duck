import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';

@Module({
    imports: [TerminusModule, UserModule],
    controllers: [AppController],
})
export class AppModule {}
