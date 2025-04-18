import { Injectable } from '@nestjs/common';
import { Prisma, Subscription } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PrismaClientTransaction } from 'src/common/types';

@Injectable()
export class SubscriptionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findActiveByAppId(appId: string, tx?: PrismaClientTransaction): Promise<Subscription | null> {
        const client = tx || this.prisma;
        return client.subscription.findFirst({
            where: { appId, isActive: true },
        });
    }

    async create(
        data: Prisma.SubscriptionCreateInput,
        tx?: PrismaClientTransaction,
    ): Promise<Subscription> {
        const client = tx || this.prisma;
        return client.subscription.create({ data });
    }

    async update(
        id: string,
        data: Prisma.SubscriptionUpdateInput,
        tx?: PrismaClientTransaction,
    ): Promise<Subscription> {
        const client = tx || this.prisma;
        return client.subscription.update({
            where: { id },
            data,
        });
    }

    async updateMany(
        where: Prisma.SubscriptionWhereInput,
        data: Prisma.SubscriptionUpdateInput,
        tx?: PrismaClientTransaction,
    ): Promise<Prisma.BatchPayload> {
        const client = tx || this.prisma;
        return client.subscription.updateMany({ where, data });
    }

    async findById(id: string, tx?: PrismaClientTransaction): Promise<Subscription | null> {
        const client = tx || this.prisma;
        return client.subscription.findUnique({
            where: { id },
            include: { plan: true, app: true, user: true },
        });
    }

    async findFirstQueuedAfterDate(
        appId: string,
        date: Date,
        tx?: PrismaClientTransaction,
    ): Promise<Subscription | null> {
        const client = tx || this.prisma;
        return client.subscription.findFirst({
            where: {
                appId,
                isQueued: true,
                startsAt: { gte: date },
            },
            orderBy: { startsAt: 'asc' },
        });
    }

    async $transaction<T>(fn: (tx: PrismaClientTransaction) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}