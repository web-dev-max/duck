import { Module } from '@nestjs/common';
import { PaykeeperController } from './controllers/paykeeper.controller';
import { PaykeeperService } from './services/paykeeper.service';

@Module({
    controllers: [PaykeeperController],
    providers: [PaykeeperService],
    exports: [PaykeeperService],
})
export class PaykeeperModule {}
