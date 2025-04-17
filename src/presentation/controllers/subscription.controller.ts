import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/application/services/app.service';
import { PlanService } from 'src/application/services/plan.service';
import { SubscriptionService } from 'src/application/services/subscription.service';

@Controller('subscriptions')
@ApiTags('Subscriptions')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: PlanService,
    private readonly appService: AppService,
  ) {}

  @Get('/plans')
  @ApiOperation({ summary: 'Get all available plans' })
  async getPlans() {
    return this.planService.findAll();
  }

  @Post('/subscribe')
  @ApiOperation({ summary: 'Subscribe to a plan' })
  async subscribe(
    @Body() body: { planType: string },
    @Headers('x-api-key') apiKey: string,
    // FIXME: @User() user: User,
  ) {
    const apiKeyRecord = await this.appService.validateAppKey(apiKey);
    return this.subscriptionService.subscribeToPlan(
      'user.id',
      apiKeyRecord.id,
      body.planType,
    );
  }
}
