import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPlanRepository } from '../../domain/interfaces/plan.repository.interface';
import { ISubscriptionRepository } from './../../domain/interfaces/subscription.repository.interface';
import { Subscription } from './../../domain/entities/subscription.entity';
import { Plan } from './../../domain/entities/plan.entity';
import { IAppRepository } from './../../domain/interfaces/app.repository.interface';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('IPlanRepository') private readonly planRepository: IPlanRepository,
    @Inject('ISubscriptionRepository') private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject('IAppRepository') private readonly appRepository: IAppRepository,
    // private readonly userService: UserService,
  ) {}

  async subscribeToPlan(
    userId: string,
    appKey: string,
    planType: string,
  ): Promise<Subscription> {
    const plan = await this.planRepository.findByType(planType);
    if (!plan) throw new NotFoundException('Plan not found');

    const app = await this.appRepository.validateAppApiKey(appKey);
    if (!app) throw new NotFoundException('App not found');

    const existingSubscription =
      await this.subscriptionRepository.findActiveSubscription(app.id);

    if (existingSubscription) {
      return this.subscriptionRepository.update(existingSubscription.id, {
        planId: plan.id,
        startsAt: new Date(),
        endsAt: this.calculateEndDate(plan),
        isActive: true,
      });
    }

    return this.subscriptionRepository.create({
      planId: plan.id,
      userId,
      appId: app.id,
      startsAt: new Date(),
      endsAt: this.calculateEndDate(plan),
      isActive: true,
    });
  }

  private calculateEndDate(plan: Plan): Date {
    const date = new Date();

    // TODO: Free for ever and annual sub
    if (plan.type === 'FREE') {
      date.setDate(date.getDate() + 30); // Free trial period
    } else {
      date.setMonth(date.getMonth() + 1); // Monthly subscription
    }
    return date;
  }
}
