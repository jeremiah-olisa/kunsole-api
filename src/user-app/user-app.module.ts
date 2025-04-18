import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserAppRepository } from './repositories/user-app.repository';
import { UserAppService } from './user-app.service';
import { UserAppController } from './user-app.controller';

@Module({
  providers: [UserAppService, UserAppRepository, PrismaService],
  controllers: [UserAppController],
  exports: [UserAppService],
})
export class UserAppModule {}