import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserAppRepository } from './repositories/user-app.repository';
import { UserAppService } from './user-app.service';
import { UserAppController } from './user-app.controller';
import { MailModule } from 'src/mail/mail.module';
import { CacheModule } from 'src/cache/cache.module';
import { AppModule } from 'src/app/app.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CacheModule, MailModule, AppModule, UserModule],
  providers: [UserAppService, UserAppRepository, PrismaService],
  controllers: [UserAppController],
  exports: [UserAppService],
})
export class UserAppModule { }
