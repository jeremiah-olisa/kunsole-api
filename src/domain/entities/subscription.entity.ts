import { Subscription as ISubscription } from '@prisma/client';

/* The class Subscriptions extends the interface ISubscription. */
export class Subscription implements ISubscription {
  id: string;
  planId: string;
  userId: string;
  appId: string;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ISubscription>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
}
