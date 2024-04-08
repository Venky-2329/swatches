import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { ApplicationExceptionHandler } from 'libs/backend-utils';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService,ApplicationExceptionHandler],
  imports: [TypeOrmModule.forFeature([SupplierEntity])],
})
export class SupplierModule {}
