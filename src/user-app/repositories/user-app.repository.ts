import { Injectable } from '@nestjs/common';
import { UserApp, AppUserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { IKeysetPaginationParams } from 'src/common/interfaces/pagination.interface';
import { PaginatedResult } from 'src/common/entities/pagination.entity';
import {
  PAGINATION_SIZE_DEFAULT_LIMIT,
  PAGINATION_SIZE_MAX_LIMIT,
} from 'src/common/constants/pagination.constant';
import { PrismaClientTransaction } from 'src/common/types';

@Injectable()
export class UserAppRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createUserApp(
    data: {
      appId: string;
      userId: string;
      role: AppUserRole;
    },
    tx?: PrismaClientTransaction,
  ): Promise<UserApp> {
    const client = tx || this.prisma;
    return client.userApp.create({
      data: {
        appId: data.appId,
        userId: data.userId,
        role: data.role,
      },
    });
  }

  async updateUserRole(
    appId: string,
    userId: string,
    role: AppUserRole,
    tx?: PrismaClientTransaction,
  ): Promise<UserApp> {
    const client = tx || this.prisma;

    const userAppId = await this.getUserAppId(userId, appId, tx);

    return client.userApp.update({
      where: userAppId,
      data: { role },
    });
  }

  async removeUserFromApp(
    appId: string,
    userId: string,
    tx?: PrismaClientTransaction,
  ): Promise<UserApp> {
    const client = tx || this.prisma;

    const userAppId = await this.getUserAppId(userId, appId, tx);

    return client.userApp.delete({
      where: userAppId,
    });
  }

  async getUserAppId(
    userId: string,
    appId: string,
    tx?: PrismaClientTransaction,
  ) {
    const client = tx || this.prisma;

    return await client.userApp.findFirstOrThrow({
      where: {
        userId,
        appId,
      },
      select: { id: true },
    });
  }

  async getUserApps(
    userId: string,
    pagination?: IKeysetPaginationParams,
    tx?: PrismaClientTransaction,
  ): Promise<PaginatedResult<UserApp>> {
    const client = tx || this.prisma;
    const limit = Math.min(
      pagination?.limit || PAGINATION_SIZE_DEFAULT_LIMIT,
      PAGINATION_SIZE_MAX_LIMIT,
    );
    const direction = pagination?.direction || 'forward';
    const cursor = pagination?.cursor ? { id: pagination.cursor } : undefined;

    const [items, total] = await Promise.all([
      client.userApp.findMany({
        where: { userId },
        cursor,
        take: direction === 'forward' ? limit : -limit,
        skip: cursor ? 1 : 0,
        orderBy: { createdAt: 'desc' },
        include: {
          app: true,
        },
      }),
      client.userApp.count({ where: { userId } }),
    ]);

    return {
      data: items,
      nextCursor: items.length > 0 ? items[items.length - 1]?.id : undefined,
      prevCursor: items.length > 0 ? items[0]?.id : undefined,
      total,
    };
  }

  async findByUserAndApp(
    userId: string,
    appId: string,
    tx?: PrismaClientTransaction,
    isActive = true,
  ) {
    const client = tx || this.prisma;
    return client.userApp.findFirst({
      where: {
        userId,
        appId,
        isActive,
      },
      select: {
        role: true,
        user: { select: { email: true } },
      },
    });
  }

  async userHasAccessToApp(
    userId: string,
    appId: string,
    tx?: PrismaClientTransaction,
    isActive = true,
  ) {
    const client = tx || this.prisma;
    return (
      (await client.userApp.count({
        where: {
          userId,
          appId,
          isActive,
        },
      })) > 0
    );
  }
}
