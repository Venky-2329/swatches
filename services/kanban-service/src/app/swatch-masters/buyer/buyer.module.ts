import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './entities/buyer.entity';

@Module({
  controllers: [BuyerController ],
  providers: [BuyerService],
  imports: [TypeOrmModule.forFeature([BuyerEntity])],
})
export class BuyerModule {}
