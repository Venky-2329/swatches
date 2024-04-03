import { Module } from '@nestjs/common';
import { TrimSwatchService } from './trim-swatch.service';
import { TrimSwatchController } from './trim-swatch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { ApplicationExceptionHandler } from 'libs/backend-utils';
import { MailerService } from '../fabric-swatch/send-mail';
import { TrimUploadEntity } from './entities/trim-swatch-upload-entity';

@Module({
  controllers: [TrimSwatchController],
  providers: [TrimSwatchService,ApplicationExceptionHandler,MailerService],
  imports:[TypeOrmModule.forFeature([TrimSwatchEntity , TrimUploadEntity])]
})
export class TrimSwatchModule {}
