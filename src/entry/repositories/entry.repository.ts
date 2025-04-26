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
  constructor(private readonly prisma: PrismaService) { }

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

    const where: Prisma.EntryWhereInput = this.filterEntries(filters);

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

  private filterEntries(filters: IEntryFilters): Prisma.EntryWhereInput {
    const whereInput: Prisma.EntryWhereInput = {};

    // Apply filters based on presence of the corresponding filter value
    if (filters.type) whereInput.type = filters.type;
    if (filters.appId) whereInput.appId = filters.appId;

    if (filters.userId) {
      whereInput.OR = [
        { userId: filters.userId },
        { app: { userApp: { some: { userId: filters.userId } } } }
      ];
    }

    if (filters.fromDate || filters.toDate) {
      whereInput.loggedAt = {
        ...(filters.fromDate && { gte: new Date(filters.fromDate) }),
        ...(filters.toDate && { lte: new Date(filters.toDate) })
      };
    }

    if (typeof filters.isRead === 'boolean') {
      whereInput.readAt = filters.isRead ? { not: null } : null;
    }

    return whereInput;
  }

}
