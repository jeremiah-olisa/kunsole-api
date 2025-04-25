import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  Req,
  Query,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { SwaggerAuthenticated } from 'src/auth/decorators/swagger-auth.decorator';
import { Request } from 'express';
import { PaginatedResultPaymentEntity } from './entities/payment.entity';
import { PaymentQuery } from './interfaces';
import { UserEntity } from 'src/auth/entities/user.entity';

@ApiTags('Payments')
@Controller('payments')
@SwaggerAuthenticated()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List user payments' })
  @ApiQuery({
    name: 'PaymentQuery',
    type: PaymentQuery,
    required: false,
    description: 'Keyset pagination query params',
  })
  @ApiResponse({
    status: 200,
    description: 'List of payments',
    type: PaginatedResultPaymentEntity,
  })
  async getUserPayments(@Query() query: PaymentQuery, @Req() req: Request) {
    const user = new UserEntity(req.user);

    return this.paymentService.getUserPayments(
      user.getUserId(),
      query.getFilters(),
      query.getPagination(),
    );
  }

  @Get('app/:appId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List payments for an app' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of payments',
    type: PaginatedResultPaymentEntity,
  })
  async getAppPayments(
    @Param('appId') appId: string,
    @Query() pagination: any,
    @Req() req: Request,
  ) {
    const user = new UserEntity(req.user);

    return this.paymentService.getAppPayments(
      appId,
      {
        ...pagination,
        userId: user.getUserId(),
      },
      pagination,
    );
  }
}
