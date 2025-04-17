import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Entry } from '../../domain/entities/entry.entity';
import {
  EntryFilters,
  IEntryRepository,
} from '../../domain/interfaces/entry.repository.interface';
import { Prisma } from './../../infrastructure/prisma/client';

@Injectable()
export class EntryRepository implements IEntryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findEntriesByAppKey(
    appKey: string,
    filters?: EntryFilters,
  ): Promise<Entry[]> {
    const where = this.filterEntries(filters, {
      app: { OR: [{ id: appKey }, { publicKey: appKey }] },
    });

    const entries = await this.prisma.entry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => new Entry(e));
  }

  private filterEntries(
    filters: EntryFilters | undefined,
    where: Prisma.EntryWhereInput,
  ) {
    if (filters) {
      if (filters.type) where.type = filters.type;
      if (filters.isRead !== undefined) {
        filters.isRead ? (where.readAt = { not: null }) : (where.readAt = null);
      }
      if (filters.fromDate || filters.toDate) {
        where.createdAt = {};
        if (filters.fromDate) where.createdAt.gte = filters.fromDate;
        if (filters.toDate) where.createdAt.lte = filters.toDate;
      }
    }

    return where;
  }

  async countRecentEntries(appId: string): Promise<number> {
    const latestSubscription = await this.prisma.subscription.findFirst({
      where: { appId },
      orderBy: { startsAt: 'desc' },
    });

    if (!latestSubscription) {
      throw new NotFoundException('No subscription found for the given appId');
    }

    const oneWeekAgo = latestSubscription.startsAt;

    const count = await this.prisma.entry.count({
      where: {
        appId,
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    return count;
  }

  async createEntry(entry: Entry): Promise<Entry> {
    const created = await this.prisma.entry.create({
      data: {
        ...entry,
        metadata: entry.metadata || undefined,
      },
    });
    return new Entry({ ...created, readAt: created.readAt ?? null });
  }

  async findEntriesByUserId(
    userId: string,
    filters?: EntryFilters,
  ): Promise<Entry[]> {
    const where = this.filterEntries(filters, {
      app: { userApp: { some: { userId } } },
    });

    const entries = await this.prisma.entry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return entries.map((e) => new Entry(e));
  }

  async markEntryAsRead(entryId: string): Promise<Entry> {
    const updated = await this.prisma.entry.update({
      where: { id: entryId },
      data: { readAt: new Date() },
    });
    return new Entry(updated);
  }
}
