import { Subscription } from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  create(
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Subscription>;
  findActiveSubscription(appId: string): Promise<Subscription | null>;
  getAppLastSubscriptionStartDate(appId: string): Promise<Date | null>;
  update(
    subscriptionId: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription>;
}
