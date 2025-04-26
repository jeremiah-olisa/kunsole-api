import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaystackProvider } from './paystack.provider';
import { FlutterwaveProvider } from './flutterwave.provider';
import { IPaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentProvider } from '@prisma/client';
import { ModuleRef } from '@nestjs/core';
import { getClassName } from 'src/common/utils';

@Injectable()
export class PaymentProviderFactory {
  private readonly defaultPaymentProvider: PaymentProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    this.defaultPaymentProvider =
      this.configService.getOrThrow<PaymentProvider>('DEFAULT_PAYMENT_PROVIDER');
  }

  getProvider(provider?: PaymentProvider): IPaymentProvider {
    provider ??= this.defaultPaymentProvider;

    switch (provider) {
      case PaymentProvider.PAYSTACK:
        return this.moduleRef.get<PaystackProvider>(PaystackProvider, { strict: false });
      case PaymentProvider.FLUTTERWAVE:
        return this.moduleRef.get<FlutterwaveProvider>(FlutterwaveProvider, { strict: false });
      default:
        throw new InternalServerErrorException(
          `Unsupported payment provider: ${provider}`,
        );
    }
  }
}
