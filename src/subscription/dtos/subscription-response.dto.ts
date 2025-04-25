import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the subscription.',
    example: 'sub-1234abcd5678efgh',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the plan associated with the subscription.',
    example: 'plan-987654321',
  })
  planId: string;

  @ApiProperty({
    description: 'The ID of the app associated with the subscription.',
    example: 'app-1234abcd5678efgh',
  })
  appId: string;

  @ApiProperty({
    description: 'The ID of the user who owns the subscription.',
    example: 'user-1234567890',
  })
  userId: string;

  @ApiProperty({
    description:
      'The payment ID associated with the subscription (if any). This is optional.',
    example: 'pay-9876abcd1234efgh',
    required: false,
  })
  paymentId?: string;

  @ApiProperty({
    description: 'The start date of the subscription.',
    example: '2023-01-01T00:00:00.000Z',
  })
  startsAt: Date;

  @ApiProperty({
    description: 'The end date of the subscription.',
    example: '2024-01-01T00:00:00.000Z',
  })
  endsAt: Date;

  @ApiProperty({
    description:
      'Indicates whether the subscription is currently active or not.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Indicates whether the subscription is queued for processing.',
    example: false,
  })
  isQueued: boolean;

  @ApiProperty({
    description: 'The date and time when the subscription was created.',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the subscription was last updated.',
    example: '2023-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}
