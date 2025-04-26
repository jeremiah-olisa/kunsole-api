import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepository } from './repositories/app.repository';
import { PrismaService } from 'nestjs-prisma';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppRepository, PrismaService],
  exports: [AppService],
})
export class AppModule {}
