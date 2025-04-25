import { Injectable, NotFoundException } from '@nestjs/common';
import { AppUserRole, PaymentProvider } from '@prisma/client';
import { PrismaClientTransaction } from 'src/common/types';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { PaymentService } from 'src/payment/payment.service';
import { UserAppService } from 'src/user-app/user-app.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly repository: SubscriptionRepository,
        private readonly paymentService: PaymentService,
        private readonly userAppService: UserAppService,
    ) { }

    async createSubscription(dto: CreateSubscriptionDto, userId: string) {
        // Verify user has permission
        const userApp = await this.userAppService.findByUserAndApp(userId, dto.appId);
        const permiddedRoles: AppUserRole[] = [AppUserRole.OWNER, AppUserRole.ADMIN];

        if (!userApp || !permiddedRoles.includes(userApp.role)) {
            throw new NotFoundException('You do not have permission to create subscriptions for this app');
        }

        return this.repository.$transaction(async (tx) => {
            const activeSub = await this.repository.findActiveByUserId(dto.appId, tx);

            const subscription = await this.repository.create(
                {
                    plan: { connect: { id: dto.planId } },
                    user: { connect: { id: userId } },
                    startsAt: activeSub ? undefined : new Date(), // Will be set when activated
                    endsAt: undefined, // Will be calculated when activated
                    isActive: !activeSub,
                    isQueued: !!activeSub,
                },
                tx,
            );

            const payment = await this.paymentService.initiatePayment({
                amount: dto.amount,
                appId: dto.appId,
                userId,
                subscriptionId: subscription.id,
                provider: dto.paymentProvider,
                email: userApp.user.email,
            });

            return { subscription, payment };
        });
    }

    async handlePaymentSuccess(subscriptionId: string) {
        const subscription = await this.repository.findById(subscriptionId);
        if (!subscription) return;

        await this.repository.$transaction(async (tx) => {
            // Deactivate current active subscriptions
            await this.repository.updateMany(
                { userId: subscription.userId, isActive: true },
                { isActive: false },
                tx,
            );

            // Calculate end date based on plan duration
            const endsAt = this.calculateEndDate(subscription.planId);

            // Activate the new subscription
            await this.repository.update(
                subscriptionId,
                {
                    startsAt: new Date(),
                    endsAt,
                    isActive: true,
                    isQueued: false,
                },
                tx,
            );

            // Activate next queued subscription if exists
            await this.activateNextQueuedSubscription(subscriptionId, tx);
        });
    }

    private async activateNextQueuedSubscription(
        currentSubscriptionId: string,
        tx?: PrismaClientTransaction,
    ) {
        const currentSub = await this.repository.findById(currentSubscriptionId, tx);
        if (!currentSub || !currentSub.endsAt) return;

        const nextQueued = await this.repository.findFirstQueuedAfterDate(
            currentSub.userId,
            currentSub.endsAt,
            tx,
        );

        if (nextQueued) {
            await this.repository.update(
                nextQueued.id,
                { isQueued: false },
                tx,
            );
        }
    }

    async handlePaystackWebhook(body: any, signature: string) {
        // Verify signature
        const provider = this.paymentService.getProvider(PaymentProvider.PAYSTACK);
        const verification = await provider.verifyPayment(body.data.reference);

        if (verification.status === 'success') {
            await this.handleSuccessfulPayment(
                body.data.reference,
                verification.metadata.subscriptionId,
            );
        }
    }

    async handleFlutterwaveWebhook(body: any, signature: string) {
        // Verify signature
        const provider = this.paymentService.getProvider(PaymentProvider.FLUTTERWAVE);
        const verification = await provider.verifyPayment(body.data.tx_ref);

        if (verification.status === 'success') {
            await this.handleSuccessfulPayment(
                body.data.tx_ref,
                verification.metadata.subscriptionId,
            );
        }
    }

    private async handleSuccessfulPayment(reference: string, subscriptionId?: string) {
        await this.paymentService.updateByReference(reference);

        if (subscriptionId) {
            await this.handlePaymentSuccess(subscriptionId);
        }
    }

    private calculateEndDate(planId: string): Date {
        const endDate = new Date();
        // Add plan duration (customize based on your plan durations)
        endDate.setMonth(endDate.getMonth() + this.getPlanDuration(planId));
        return endDate;
    }

    private getPlanDuration(planId: string): number {
        // Implement your plan duration logic here
        // Example:
        const planDurations = {
            'free-plan': 1,
            'basic-plan': 1,
            'premium-plan': 3,
        };
        return planDurations[planId] || 1; // Default to 1 month
    }
}