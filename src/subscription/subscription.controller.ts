import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionResponseDto } from './dtos/subscription-response.dto';
import { SwaggerAuthenticated } from 'src/auth/decorators/swagger-auth.decorator';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@SwaggerAuthenticated()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new subscription' })
  // @ApiBody({ type: CreateSubscriptionDto })
  // @ApiResponse({
  //     status: 201,
  //     description: 'Subscription created successfully',
  //     type: SubscriptionResponseDto,
  // })
  // @ApiResponse({
  //     status: 403,
  //     description: 'Forbidden - User lacks permission',
  // })
  // async create(
  //     @Body() createSubscriptionDto: CreateSubscriptionDto,
  //     @Req() req: Request,
  // ) {
  //     return this.subscriptionService.createSubscription(createSubscriptionDto, req.user.id);
  // }

  @Post('webhook/paystack')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Paystack payment webhook' })
  async handlePaystackWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    await this.subscriptionService.handlePaystackWebhook(body, signature);
  }

  @Post('webhook/flutterwave')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Flutterwave payment webhook' })
  async handleFlutterwaveWebhook(
    @Body() body: any,
    @Headers('verif-hash') signature: string,
  ) {
    await this.subscriptionService.handleFlutterwaveWebhook(body, signature);
  }
}
