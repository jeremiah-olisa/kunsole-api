import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PaymentProvider } from '@prisma/client';
import { IKeysetPaginationParams, IPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { PaymentProviderFactory } from './providers/payment-provider.factory';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { InitiatePaymentDto } from './dtos/initiate-payment.dto';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentFilters } from './interfaces';

@Injectable()
export class PaymentService {
    constructor(
        private readonly repository: PaymentRepository,
        private readonly providerFactory: PaymentProviderFactory,
    ) { }

    getProvider(provider?: PaymentProvider) {
        return this.providerFactory.getProvider(provider);
    }

    async initiatePayment(dto: InitiatePaymentDto) {
        const provider = this.getProvider(dto.provider);
        const result = await provider.initiatePayment(
            dto.amount,
            dto.email || 'user@example.com',
            {
                appId: dto.appId,
                userId: dto.userId,
                subscriptionId: dto.subscriptionId,
            },
        );

        const payment = await this.repository.create({
            amount: dto.amount,
            reference: result.paymentReference,
            provider: dto.provider ?? provider.getProviderName(),
            app: { connect: { id: dto.appId } },
            user: { connect: { id: dto.userId } },
            subscription: dto.subscriptionId
                ? { connect: { id: dto.subscriptionId } }
                : undefined,
        });

        return {
            ...payment,
            authorizationUrl: result.authorizationUrl,
        };
    }

    async getUserPayments(
        userId: string,
        filter: PaymentFilters,
        pagination?: IKeysetPaginationParams,
    ) {
        return this.repository.findAll({
            ...filter,
            userId
        }, pagination);
    }

    async getAppPayments(
        appId: string,
        filter: PaymentFilters,
        pagination?: IKeysetPaginationParams,
    ) {
        return this.repository.findAll({
            ...filter,
            appId
        }, pagination);
    }

    async updateByReference(reference: string) {
        return await this.repository.updateByReference(reference, {
            status: 'COMPLETED',
        });
    }
}