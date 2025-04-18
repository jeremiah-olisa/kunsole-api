import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanRepository } from './repositories/plan.repository';
import { IKeysetPaginationParams, IPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { PlanEntity } from './entities/plan.entity';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { CreatePlanDto } from './dtos/create-plan.dto';

@Injectable()
export class PlanService {
    constructor(private readonly planRepository: PlanRepository) { }

    async createPlan(createPlanDto: CreatePlanDto): Promise<PlanEntity> {
        const plan = await this.planRepository.create(createPlanDto);
        return new PlanEntity(plan);
    }

    async getPlanById(id: string): Promise<PlanEntity> {
        const plan = await this.planRepository.findById(id);
        if (!plan) {
            throw new NotFoundException('Plan not found');
        }
        return new PlanEntity(plan);
    }

    async getPlanByType(type: string): Promise<PlanEntity[]> {
        const plans = await this.planRepository.findByType(type as any);

        return plans.map((plan) => new PlanEntity(plan));
    }

    async getAllPlans(
        pagination?: IKeysetPaginationParams,
    ): Promise<IPaginatedResult<PlanEntity>> {
        const result = await this.planRepository.findAll(pagination);
        return {
            ...result,
            data: result.data.map((plan) => new PlanEntity(plan)),
        };
    }

    async updatePlan(
        id: string,
        updatePlanDto: UpdatePlanDto,
    ): Promise<PlanEntity> {
        const plan = await this.planRepository.update(id, updatePlanDto);
        return new PlanEntity(plan);
    }

    async deletePlan(id: string): Promise<void> {
        await this.planRepository.delete(id);
    }

    async getFreePlanId(): Promise<string | null> {
        const freePlan = await this.planRepository.findByPrice(0, { id: true });
        return freePlan?.id ?? null;
    }
}