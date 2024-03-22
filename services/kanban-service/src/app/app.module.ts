import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RacksModule } from './masters/racks/racks.module';
import { DatabaseModule } from './database-connections/database.module';
import { CategoryModule } from './masters/category/category.module';
import { BrandsModule } from './masters/brands/brands.module';
import { SeasonModule } from './masters/season/season.module';
import { SampleUploadModule } from './masters/sample-upload/sample-upload.module';
import { LocationModule } from './masters/location/location.module';
import { UsersModule } from './masters/users/user.module';
import { FabricSwatchModule } from './swatch-masters/fabric-swatch/fabric-swatch.module';
import { BuyerModule } from './swatch-masters/buyer/buyer.module';
import { SupplierModule } from './swatch-masters/supplier/supplier.module';
import { TrimSwatchEntity } from './swatch-masters/trim-swatch/entities/trim-swatch.entity';
import { TrimSwatchModule } from './swatch-masters/trim-swatch/trim-swatch.module';

@Module({
  imports: [DatabaseModule,RacksModule,CategoryModule,BrandsModule,SeasonModule,SampleUploadModule,LocationModule,UsersModule,FabricSwatchModule ,BuyerModule,SupplierModule , TrimSwatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
