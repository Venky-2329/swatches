import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RacksModule } from './masters/racks/racks.module';
import { DatabaseModule } from './database-connections/database.module';

@Module({
  imports: [DatabaseModule,RacksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
