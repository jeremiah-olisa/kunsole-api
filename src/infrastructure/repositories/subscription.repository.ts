import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISubscriptionRepository } from 'src/domain/interfaces/subscription.repository.interface';
import { Subscription } from 'src/domain/entities/subscription.entity';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        ...subscription,
      },
    });
  }

  async findActiveSubscription(appId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        app: { OR: [{ apiKey: appId }, { id: appId }] },
        isActive: true,
        endsAt: { gt: new Date() }, // Subscription hasn't expired
      },
      orderBy: { startsAt: 'desc' }, // Get the most recent active subscription
      include: { plan: true }, // Include plan details
    });
  }

  async getAppLastSubscriptionStartDate(appId: string): Promise<Date | null> {
    const lastSubscription = await this.prisma.subscription.findFirst({
      where: {
        app: { OR: [{ apiKey: appId }, { id: appId }] },
      },
      orderBy: { startsAt: 'desc' },
      select: { startsAt: true },
    });

    return lastSubscription?.startsAt || null;
  }

  async update(
    subscriptionId: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        ...updates,
        // updatedAt: new Date(), // Always update the timestamp
      },
    });
  }
}
