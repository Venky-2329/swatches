import { Module } from '@nestjs/common';
import { TrimSwatchService } from './trim-swatch.service';
import { TrimSwatchController } from './trim-swatch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { ApplicationExceptionHandler } from 'libs/backend-utils';

@Module({
  controllers: [TrimSwatchController],
  providers: [TrimSwatchService,ApplicationExceptionHandler],
  imports:[TypeOrmModule.forFeature([TrimSwatchEntity])]
})
export class TrimSwatchModule {}
