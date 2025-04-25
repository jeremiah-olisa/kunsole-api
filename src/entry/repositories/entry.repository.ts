import { Injectable } from '@nestjs/common';
import { Prisma, Entry, EntryType } from '@prisma/client';
import { IEntryFilters } from '../interfaces/entry.interface';
import { PrismaService } from 'nestjs-prisma';
import { IKeysetPaginationParams } from 'src/common/interfaces/pagination.interface';
import { PaginatedResult } from 'src/common/entities/pagination.entity';
import {
  EntryEntity,
  PaginatedResultEntryEntity,
} from '../entities/entry.entity';
import {
  PAGINATION_SIZE_DEFAULT_LIMIT,
  PAGINATION_SIZE_MAX_LIMIT,
} from 'src/common/constants/pagination.constant';

@Injectable()
export class EntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EntryCreateInput): Promise<Entry> {
    return this.prisma.entry.create({ data });
  }

  async findById(id: string): Promise<Entry | null> {
    return this.prisma.entry.findUnique({
      where: { id },
      include: {
        user: true,
        app: true,
      },
    });
  }

  async markAsRead(id: string): Promise<Entry> {
    return this.prisma.entry.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async findAll(
    filters: IEntryFilters,
    pagination?: IKeysetPaginationParams,
  ): Promise<PaginatedResultEntryEntity> {
    const limit = Math.min(
      pagination?.limit || PAGINATION_SIZE_DEFAULT_LIMIT,
      PAGINATION_SIZE_MAX_LIMIT,
    );
    const direction = pagination?.direction || 'forward';
    const cursor = pagination?.cursor ? { id: pagination.cursor } : undefined;

    const where: Prisma.EntryWhereInput = {
      ...(filters.type && { type: filters.type }),
      ...(filters.appId && { appId: filters.appId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.fromDate && {
        loggedAt: { gte: new Date(filters.fromDate) },
      }),
      ...(filters.toDate && { loggedAt: { lte: new Date(filters.toDate) } }),
      ...(typeof filters.isRead === 'boolean' && {
        readAt: filters.isRead ? { not: null } : null,
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.entry.findMany({
        where,
        cursor,
        take: direction === 'forward' ? limit : -limit,
        skip: cursor ? 1 : 0,
        orderBy: { loggedAt: 'desc' },
        include: {
          user: true,
          app: true,
        },
      }),
      this.prisma.entry.count({ where }),
    ]);

    return {
      data: items,
      nextCursor: items.length > 0 ? items[items.length - 1]?.id : undefined,
      prevCursor: items.length > 0 ? items[0]?.id : undefined,
      total,
    } as PaginatedResultEntryEntity;
  }
}
