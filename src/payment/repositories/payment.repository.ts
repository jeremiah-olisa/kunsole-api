import { Injectable } from "@nestjs/common";
import { Payment, Prisma } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { PaginatedResult } from "src/common/entities/pagination.entity";
import { IKeysetPaginationParams } from "src/common/interfaces/pagination.interface";
import { PaymentFilters } from "../interfaces";
import { PAGINATION_SIZE_DEFAULT_LIMIT, PAGINATION_SIZE_MAX_LIMIT } from "src/common/constants/pagination.constant";

@Injectable()
export class PaymentRepository {

    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        return this.prisma.payment.create({ data });
    }

    async findByReference(reference: string): Promise<Payment | null> {
        return this.prisma.payment.findUnique({
            where: { reference },
            include: {
                user: { select: { fullName: true, email: true } },
                subscription: true,
            },
        });
    }

    async updateByReference(reference: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
        return this.prisma.payment.update({
            where: { reference },
            data,
        });
    }

    async findAll(
        filters: PaymentFilters,
        pagination?: IKeysetPaginationParams,
    ): Promise<PaginatedResult<Payment>> {
        const limit = Math.min(pagination?.limit || PAGINATION_SIZE_DEFAULT_LIMIT, PAGINATION_SIZE_MAX_LIMIT);
        const direction = pagination?.direction || 'forward';
        const cursor = pagination?.cursor ? { id: pagination.cursor } : undefined;

        const where: Prisma.PaymentWhereInput = {
            ...(filters.userId && { userId: filters.userId }),
            ...(filters.appId && { appId: filters.appId }),
            ...(filters.status && { status: filters.status }),
            ...(filters.provider && { provider: filters.provider }),
        };

        const [items, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                cursor,
                take: direction === 'forward' ? limit : -limit,
                skip: cursor ? 1 : 0,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { fullName: true, email: true } },
                    subscription: true,
                },
            }),
            this.prisma.payment.count({ where }),
        ]);

        return {
            data: items,
            nextCursor: items.length > 0 ? items[items.length - 1]?.id : undefined,
            prevCursor: items.length > 0 ? items[0]?.id : undefined,
            total,
        };
    }

    async getPaymentMetrics(userId?: string) {
        return this.prisma.payment.groupBy({
            by: ['status'],
            where: { userId },
            _count: { _all: true },
            _sum: { amount: true },
        });
    }
}