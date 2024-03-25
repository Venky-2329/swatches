import { Module } from '@nestjs/common';
import { ApprovalUsersService } from './approval-users.service';
import { ApprovalUsersController } from './approval-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalUserEntity } from './entities/approval-user.entity';
import { ApplicationExceptionHandler } from 'libs/backend-utils';

@Module({
  controllers: [ApprovalUsersController],
  providers: [ApprovalUsersService , ApplicationExceptionHandler],
  imports :[ TypeOrmModule.forFeature([ApprovalUserEntity])]
})
export class ApprovalUsersModule {}
