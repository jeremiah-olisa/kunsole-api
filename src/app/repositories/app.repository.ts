import { Injectable } from '@nestjs/common';
import { Prisma, App, AppUserRole } from '@prisma/client';
import {
  IKeysetPaginationParams,
  IPaginatedResult,
} from '../../common/interfaces/pagination.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import {
  PAGINATION_SIZE_DEFAULT_LIMIT,
  PAGINATION_SIZE_MAX_LIMIT,
} from 'src/common/constants/pagination.constant';
import { PrismaClientTransaction } from 'src/common/types';

@Injectable()
export class AppRepository {
  constructor(private readonly prisma: PrismaService) { }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }

  async findById(id: string, includeRelations = false): Promise<App | null> {
    return this.prisma.app.findUnique({
      where: { id },
    });
  }

  async getAppNameById(id: string) {
    return this.prisma.app.findFirst({
      where: { OR: [{ id }, { publicKey: id }] },
      select: { name: true },
    });
  }

  async findByPublicKey(publicKey: string): Promise<App | null> {
    return this.prisma.app.findUnique({
      where: { publicKey },
    });
  }

  async create(data: Prisma.AppCreateInput, tx?: PrismaClientTransaction): Promise<App> {
    const client = tx || this.prisma;

    return client.app.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AppUpdateInput): Promise<App> {
    return this.prisma.app.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<App> {
    return this.prisma.app.delete({
      where: { id },
    });
  }

  async findAllByUser(
    userId: string,
    pagination?: IKeysetPaginationParams,
  ): Promise<IPaginatedResult<App>> {
    const limit = Math.min(
      pagination?.limit || PAGINATION_SIZE_DEFAULT_LIMIT,
      PAGINATION_SIZE_MAX_LIMIT,
    );
    const direction = pagination?.direction || 'forward';
    const cursor = pagination?.cursor ? { id: pagination.cursor } : undefined;

    const where = {
      userApp: {
        some: { userId },
      },
    };

    const [apps, count] = await Promise.all([
      this.prisma.app.findMany({
        where,
        cursor,
        take: direction === 'forward' ? limit : -limit,
        skip: cursor ? 1 : 0,
        include: {
          userApp: {
            where: { userId },
            select: { role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.app.count({ where }),
    ]);

    return {
      data: apps,
      nextCursor: apps.length > 0 ? apps[apps.length - 1]?.id : undefined,
      prevCursor: apps.length > 0 ? apps[0]?.id : undefined,
      total: count,
    } as IPaginatedResult<App>;
  }

  async updateStatus(id: string, isActive: boolean): Promise<App> {
    return this.prisma.app.update({
      where: { id },
      data: { isActive },
    });
  }

  async findUserRole(
    appId: string,
    userId: string,
  ): Promise<AppUserRole | null> {
    const userApp = await this.prisma.userApp.findFirst({
      where: { appId, userId },
      select: { role: true },
    });

    return userApp?.role ?? null;
  }

  async validateApiKey(publicKey: string, secretKey: string): Promise<boolean> {
    const app = await this.prisma.app.findUnique({
      where: { publicKey },
      select: { secretKey: true },
    });

    if (!app) return false;
    return bcrypt.compare(secretKey, app.secretKey);
  }
}
