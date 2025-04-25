import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { PrismaService } from 'nestjs-prisma';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import { PaystackProvider } from './providers/paystack.provider';
import { FlutterwaveProvider } from './providers/flutterwave.provider';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PrismaService,
    PaymentService,
    PaymentRepository,
    PaymentProviderFactory,
    PaystackProvider,
    FlutterwaveProvider,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
