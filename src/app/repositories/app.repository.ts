import { Injectable } from '@nestjs/common';
import { Prisma, App, AppUserRole, $Enums } from '@prisma/client';
import { KeysetPaginationParams, PaginatedResult } from '../../common/interfaces/pagination.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AppRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly DEFAULT_LIMIT = 20;
    private readonly MAX_LIMIT = 100;

    async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
        return this.prisma.$transaction(fn);
    }

    async findById(id: string, includeRelations = false): Promise<App | null> {
        return this.prisma.app.findUnique({
            where: { id },
            include: this.getIncludeOptions(includeRelations),
        });
    }

    async findByPublicKey(publicKey: string): Promise<App | null> {
        return this.prisma.app.findUnique({
            where: { publicKey },
        });
    }

    async create(data: Prisma.AppCreateInput): Promise<App> {
        return this.prisma.app.create({
            data,
            include: this.getIncludeOptions(true),
        });
    }

    async update(id: string, data: Prisma.AppUpdateInput): Promise<App> {
        return this.prisma.app.update({
            where: { id },
            data,
            include: this.getIncludeOptions(true),
        });
    }

    async delete(id: string): Promise<App> {
        return this.prisma.app.delete({
            where: { id },
        });
    }

    async findAllByUser(
        userId: string,
        pagination?: KeysetPaginationParams,
    ): Promise<PaginatedResult<App>> {
        const limit = Math.min(pagination?.limit || this.DEFAULT_LIMIT, this.MAX_LIMIT);
        const direction = pagination?.direction || 'forward';
        const cursor = pagination?.cursor
            ? { id: pagination.cursor }
            : undefined;

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
                    plan: true,
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
        } as PaginatedResult<App>;
    }

    async updateStatus(id: string, isActive: boolean): Promise<App> {
        return this.prisma.app.update({
            where: { id },
            data: { isActive },
        });
    }

    async findUserRole(appId: string, userId: string): Promise<AppUserRole | null> {
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

    private getIncludeOptions(include: boolean) {
        return include
            ? {
                plan: true,
                userApp: {
                    include: {
                        user: true,
                    },
                },
            }
            : undefined;
    }
}