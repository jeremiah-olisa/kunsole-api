import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaystackProvider } from './paystack.provider';
import { FlutterwaveProvider } from './flutterwave.provider';
import { IPaymentProvider } from '../interfaces/payment-provider.interface';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class PaymentProviderFactory {
  private readonly defaultPaymentProvider: PaymentProvider;

  constructor(
    private readonly paystackProvider: PaystackProvider,
    private readonly flutterwaveProvider: FlutterwaveProvider,
    private readonly configService: ConfigService,
  ) {
    this.defaultPaymentProvider =
      this.configService.getOrThrow<PaymentProvider>(
        'DEFAULT_PAYMENT_PROVIDER',
      );
  }

  getProvider(provider?: PaymentProvider): IPaymentProvider {
    provider ??= this.defaultPaymentProvider;

    switch (provider) {
      case PaymentProvider.PAYSTACK:
        return this.paystackProvider;
      case PaymentProvider.FLUTTERWAVE:
        return this.flutterwaveProvider;
      default:
        throw new InternalServerErrorException(
          `Unsupported payment provider: ${provider}`,
        );
    }
  }
}
