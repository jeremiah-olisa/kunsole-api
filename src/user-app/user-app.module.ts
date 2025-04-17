import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserAppRepository } from './user-app.repository';

@Module({
  providers: [UserAppRepository, PrismaService],
  exports: [UserAppRepository],
})
export class UserAppModule {}