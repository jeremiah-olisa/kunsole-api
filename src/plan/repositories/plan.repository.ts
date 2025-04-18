import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Plan, PlanType, Prisma } from '@prisma/client';
import { IKeysetPaginationParams, IPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { PAGINATION_SIZE_DEFAULT_LIMIT, PAGINATION_SIZE_MAX_LIMIT } from 'src/common/constants/pagination.constant';

@Injectable()
export class PlanRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async findByType(type: PlanType): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      where: { type },
    });
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.prisma.plan.findFirst({
      where: { name },
    });
  }

  async findByPrice(price: number, select?: Prisma.PlanSelect): Promise<Plan | null> {
    return this.prisma.plan.findFirst({
      where: { price },
      select: select
    });
  }

  async findAll(
    pagination?: IKeysetPaginationParams,
  ): Promise<IPaginatedResult<Plan>> {
    const limit = Math.min(pagination?.limit || PAGINATION_SIZE_DEFAULT_LIMIT, PAGINATION_SIZE_MAX_LIMIT);
    const direction = pagination?.direction || 'forward';
    const cursor = pagination?.cursor ? { id: pagination.cursor } : undefined;

    const [items, total] = await Promise.all([
      this.prisma.plan.findMany({
        cursor,
        take: direction === 'forward' ? limit : -limit,
        skip: cursor ? 1 : 0,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.plan.count(),
    ]);

    return {
      data: items,
      nextCursor: items.length > 0 ? items[items.length - 1]?.id : undefined,
      prevCursor: items.length > 0 ? items[0]?.id : undefined,
      total,
    };
  }

  async create(data: Prisma.PlanCreateInput): Promise<Plan> {
    return this.prisma.plan.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.PlanUpdateInput,
  ): Promise<Plan> {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Plan> {
    return this.prisma.plan.delete({
      where: { id },
    });
  }
}