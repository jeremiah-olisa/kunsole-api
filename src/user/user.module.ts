import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule { }
