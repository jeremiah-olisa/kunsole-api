import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class PlanResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the plan.',
    example: 'plan-1234abcd5678efgh',
  })
  id: string;

  @ApiProperty({
    description: 'The type of the plan, such as "custom" or "system".',
    enum: $Enums.PlanType,
    example: $Enums.PlanType.CUSTOM, // Example from the $Enums.PlanType enum
  })
  type: $Enums.PlanType;

  @ApiProperty({
    description: 'Name of the plan, e.g., "Pro Plan", "Standard Plan".',
    example: 'Pro Plan',
  })
  name: string;

  @ApiProperty({
    description:
      'Detailed description of the plan, explaining its features and benefits.',
    example:
      'This plan provides advanced features for growing businesses, including priority support.',
  })
  description: string;

  @ApiProperty({
    description: 'Price of the plan in USD (or relevant currency).',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Maximum number of apps that can be used under this plan.',
    example: 10,
  })
  maxApps: number;

  @ApiProperty({
    description: 'Maximum number of users allowed under this plan.',
    example: 100,
  })
  maxUsers: number;

  @ApiProperty({
    description: 'The number of days the plan retains app entries.',
    example: 30,
  })
  entryRetentionDays: number;

  @ApiProperty({
    description: 'Maximum number of entries allowed under this plan.',
    example: 5000,
  })
  maxEntries: number;

  @ApiProperty({
    description:
      'A collection of features included in this plan, with each feature being either enabled or disabled.',
    example: {
      prioritySupport: true,
      customBranding: false,
      unlimitedIntegrations: true,
    },
    type: Object,
  })
  features: any;

  @ApiProperty({
    description: 'Timestamp when the plan was created.',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the plan was last updated.',
    example: '2023-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedResultPlanResponseDto extends PaginatedResult<PlanResponseDto> {
  @ApiProperty({ type: [PlanResponseDto] })
  declare data: PlanResponseDto[];
}
