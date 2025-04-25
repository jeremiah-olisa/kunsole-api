import { Injectable } from '@nestjs/common';
import { IPaymentProvider } from '../interfaces/payment-provider.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider } from '@prisma/client';

@Injectable()
export class PaystackProvider implements IPaymentProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow('PAYSTACK_SECRET_KEY');
    this.baseUrl = 'https://api.paystack.co';
  }

  getProviderName() {
    return PaymentProvider.FLUTTERWAVE;
  }

  handleWebhook(payload: any, signature: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async initiatePayment(
    amount: number,
    email: string,
    metadata?: any,
  ): Promise<any> {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      { amount, email, metadata },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return {
      paymentReference: response.data.data.reference,
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
    };
  }

  async verifyPayment(reference: string): Promise<any> {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return {
      status: response.data.data.status === 'success' ? 'success' : 'failed',
      amount: response.data.data.amount / 100, // Paystack uses kobo
      currency: response.data.data.currency,
      metadata: response.data.data.metadata,
    };
  }
}
