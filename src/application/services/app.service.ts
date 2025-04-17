import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAppRepository } from 'src/domain/interfaces/app.repository.interface';
import { PlanService } from './plan.service';
import { AppWithPlanEntries } from 'src/domain/entities/app.entity';
import { IPlanRepository } from 'src/domain/interfaces/plan.repository.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject('IAppRepository') private readonly appRepository: IAppRepository,
    @Inject('IPlanRepository') private readonly planRepository: IPlanRepository,
  ) { }

  async validateAppKey(key: string) {
    const app = await this.appRepository.validateAppApiKey(key);
    if (!app)
      throw new UnauthorizedException('App not found or API Key is invalid');
    return app;
  }

  async isApiKeyValid(key: string) {
    return this.appRepository.isApiKeyValid(key);
  }

  async isApiKeyValidOrThrow(key: string) {
    const valid = this.appRepository.isApiKeyValid(key);

    if (!valid)
      throw new UnauthorizedException('App not found or API Key is invalid');

    return true;
  }

  async createApp(name: string, planType: string) {
    const plan = await this.planRepository.findByType(planType);
    if (!plan) throw new NotFoundException('Plan not found');
    return this.appRepository.createApp(name, plan.id);
  }
}
