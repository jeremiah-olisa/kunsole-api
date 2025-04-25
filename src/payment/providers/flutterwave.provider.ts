import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IPaymentProvider,
  PaymentInitiationResponse,
  PaymentVerificationResponse,
} from '../interfaces/payment-provider.interface';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class FlutterwaveProvider implements IPaymentProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('FLUTTERWAVE_SECRET_KEY') ?? '';
    this.publicKey = this.configService.get('FLUTTERWAVE_PUBLIC_KEY') ?? '';
    this.encryptionKey =
      this.configService.get('FLUTTERWAVE_ENCRYPTION_KEY') ?? '';
    this.baseUrl = this.configService.get(
      'FLUTTERWAVE_BASE_URL',
      'https://api.flutterwave.com/v3',
    );
  }

  getProviderName() {
    return PaymentProvider.FLUTTERWAVE;
  }

  async initiatePayment(
    amount: number,
    email: string,
    metadata?: any,
  ): Promise<PaymentInitiationResponse> {
    const txRef = `KUNSOLE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payload = {
      tx_ref: txRef,
      amount,
      currency: 'NGN', // or other supported currencies
      payment_options: 'card',
      redirect_url: this.configService.get('FLUTTERWAVE_REDIRECT_URL'),
      customer: {
        email,
        name: metadata?.userName || 'Kunsole User',
      },
      customizations: {
        title: 'Kunsole Subscription',
        logo: this.configService.get('APP_LOGO_URL'),
      },
      meta: metadata,
    };

    try {
      const response = await axios.post(`${this.baseUrl}/payments`, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        paymentReference: txRef,
        authorizationUrl: response.data.data.link,
        accessCode: txRef, // Flutterwave uses tx_ref instead of access codes
      };
    } catch (error) {
      console.error(
        'Flutterwave payment initiation error:',
        error.response?.data,
      );
      throw new Error('Failed to initiate Flutterwave payment');
    }
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${reference}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const data = response.data.data;

      return {
        status: data.status === 'successful' ? 'success' : 'failed',
        amount: data.amount,
        currency: data.currency,
        metadata: data.meta,
      };
    } catch (error) {
      console.error(
        'Flutterwave payment verification error:',
        error.response?.data,
      );
      throw new Error('Failed to verify Flutterwave payment');
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<boolean> {
    const secretHash = this.configService.get('FLUTTERWAVE_WEBHOOK_SECRET');
    if (!secretHash) {
      throw new Error('Flutterwave webhook secret not configured');
    }

    // Verify the signature
    if (signature !== secretHash) {
      return false;
    }

    // Verify the event is a successful payment
    return (
      payload.event === 'charge.completed' &&
      payload.data.status === 'successful'
    );
  }
}
