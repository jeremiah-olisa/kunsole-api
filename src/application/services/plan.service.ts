import { Inject, Injectable } from '@nestjs/common';
import { Plan } from 'src/domain/entities/plan.entity';
import { IPlanRepository } from 'src/domain/interfaces/plan.repository.interface';

@Injectable()
export class PlanService {
  constructor(@Inject('IPlanRepository') private readonly planRepository: IPlanRepository) { }

  findAll(): Promise<Plan[]> {
    return this.planRepository.findAll();
  }

  findByType(type: string): Promise<Plan | null> {
    return this.planRepository.findByType(type);
  }
}
