import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';
import { PrismaModule } from 'src/common/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TerminusModule, 
        UserModule, 
        PrismaModule
    ],
    controllers: [AppController],
})
export class AppModule {}
