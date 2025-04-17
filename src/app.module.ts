import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppModule as KunsoleApp } from './app/app.module';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    KunsoleApp,
    PlanModule,
    SubscriptionModule,
    PaymentModule,
  ],
  providers: [],
})
export class AppModule { }
