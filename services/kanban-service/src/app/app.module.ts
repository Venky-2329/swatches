import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RacksModule } from './masters/racks/racks.module';
import { DatabaseModule } from './database-connections/database.module';
import { PdfReaderModule } from './masters/pdf-reader/pdf-reader.module';

@Module({
  imports: [DatabaseModule,RacksModule,PdfReaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
