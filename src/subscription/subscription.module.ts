import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserAppModule } from 'src/app/user-app/user-app.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PaymentModule, UserAppModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
