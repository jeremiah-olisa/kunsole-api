import { Injectable } from '@nestjs/common';
import { UserApp, AppUserRole } from '@prisma/client';
import { PrismaClientTransaction } from '../common/types';
import { PrismaService } from 'nestjs-prisma';

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

    async getUserApps(
        userId: string,
        tx?: PrismaClientTransaction,
    ): Promise<UserApp[]> {
        const client = tx || this.prisma;
        return client.userApp.findMany({
            where: { userId },
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

    async getUserAppId(userId: string, appId: string, tx?: PrismaClientTransaction) {
        const client = tx || this.prisma;

        return await client.userApp.findFirstOrThrow({
            where: {
                userId,
                appId,
            },
            select: { id: true }
        });
    }
}