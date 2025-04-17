import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Plan, PlanType } from './../../infrastructure/prisma/client';
import { IPlanRepository } from '../../domain/interfaces/plan.repository.interface';

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Plan> {
    return this.prisma.plan.create({
      data: {
        ...planData,
        features: planData.features || {},
      },
    });
  }

  async findById(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async findByType(type: PlanType): Promise<Plan | null> {
    return this.prisma.plan.findFirst({
      where: { type },
    });
  }

  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async update(id: string, updates: Partial<Plan>): Promise<Plan> {
    return this.prisma.plan.update({
      where: { id },
      data: {
        ...updates,
        features: updates.features === null ? undefined : updates.features,
        // updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.plan.delete({
      where: { id },
    });
  }

  async getDefaultPlan(): Promise<Plan> {
    const plan = await this.prisma.plan.findFirst({
      where: { type: 'FREE' },
    });

    if (!plan) {
      throw new Error('Default FREE plan not found in database');
    }
    return plan;
  }
}
