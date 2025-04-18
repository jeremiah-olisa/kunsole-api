import { PaymentProvider } from "@prisma/client";

export interface IPaymentProvider {
    getProviderName(): PaymentProvider;
    initiatePayment(amount: number, email: string, metadata?: any): Promise<PaymentInitiationResponse>;
    verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
    handleWebhook(payload: any, signature: string): Promise<boolean>;
}

export interface PaymentInitiationResponse {
    paymentReference: string;
    authorizationUrl: string;
    accessCode: string;
}

export interface PaymentVerificationResponse {
    status: 'success' | 'failed';
    amount: number;
    currency: string;
    metadata: any;
}