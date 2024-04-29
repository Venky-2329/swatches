import { Module } from '@nestjs/common';
import { FedExController } from './fed-ex.controller';
import { FedExService } from './fed-ex.service';
import { DxmShipmentCreation } from './entity/shipment-creation.entity';
import { DxmProviders } from './fed-ex.provider';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DxmShipmentCreation])],
  controllers: [FedExController],
  providers: [FedExService]
})
export class FedExModule {}
