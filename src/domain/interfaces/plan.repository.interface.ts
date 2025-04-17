import { Plan } from '@prisma/client';

export interface IPlanRepository {
  create(planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan>;
  findById(id: string): Promise<Plan | null>;
  findByType(type: string): Promise<Plan | null>;
  findAll(): Promise<Plan[]>;
  update(id: string, updates: Partial<Plan>): Promise<Plan>;
  delete(id: string): Promise<void>;
  getDefaultPlan(): Promise<Plan>;
  findByType(type: string): Promise<Plan | null>;
}
