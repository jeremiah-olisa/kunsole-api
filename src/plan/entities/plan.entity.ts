import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Plan as PrismaPlan } from '@prisma/client';

export class PlanEntity implements PrismaPlan {
  @ApiProperty({
    description: 'Unique identifier for the plan.',
    example: 'plan-1234abcd5678efgh',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the plan, e.g., "Pro Plan", "Standard Plan".',
    example: 'Pro Plan',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the plan, explaining its features.',
    example: 'This plan includes advanced features for power users.',
  })
  description: string;

  @ApiProperty({
    description: 'Price of the plan in USD (or relevant currency).',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Maximum number of apps allowed under this plan.',
    example: 10,
  })
  maxApps: number;

  @ApiProperty({
    description: 'Maximum number of users allowed under this plan.',
    example: 50,
  })
  maxUsers: number;

  @ApiProperty({
    description: 'Retention period for app entries in days.',
    example: 30,
  })
  entryRetentionDays: number;

  @ApiProperty({
    description: 'Maximum number of entries allowed under this plan.',
    example: 5000,
  })
  maxEntries: number;

  @ApiProperty({
    description: 'A collection of features available with the plan.',
    example: {
      prioritySupport: true,
      customBranding: false,
      unlimitedIntegrations: true,
    },
    type: Object,
  })
  features: Record<string, boolean>;

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

  @ApiProperty({
    description: 'The type of the plan, such as "custom" or "system".',
    enum: $Enums.PlanType,
    example: $Enums.PlanType.CUSTOM, // Example from the $Enums.PlanType enum
  })
  type: $Enums.PlanType;

  constructor(partial: Partial<PrismaPlan>) {
    Object.assign(this, partial);
  }
}
