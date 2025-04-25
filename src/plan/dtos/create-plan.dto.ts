import { ApiProperty } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    enum: PlanType,
    description:
      'The type of the plan, such as "system" or "custom" This field defines the general category of the plan.',
    example: PlanType.SYSTEM, // Example value from PlanType enum
  })
  @IsEnum(PlanType)
  type: PlanType;

  @ApiProperty({
    description:
      'The name of the plan. This is the public-facing name of the plan that users will see.',
    example: 'Basic',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'A detailed description of the plan, explaining its features, benefits, and intended audience.',
    example:
      'This plan provides advanced features for businesses that need unlimited integrations, priority support, and enhanced security.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      'The price of the plan in USD (or relevant currency). This is the cost users need to pay for subscribing to this plan.',
    example: 99.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description:
      'The maximum number of apps that can be created or associated with this plan.',
    example: 10,
  })
  @IsNumber()
  maxApps: number;

  @ApiProperty({
    description: 'The maximum number of users that can access this plan.',
    example: 50,
  })
  @IsNumber()
  maxUsers: number;

  @ApiProperty({
    description:
      'The number of days the plan retains app entries. Older entries beyond this retention period may be deleted.',
    example: 30,
  })
  @IsNumber()
  entryRetentionDays: number;

  @ApiProperty({
    description:
      'The maximum number of entries allowed in this plan. Entries could represent database records, logs, or other units.',
    example: 5000,
  })
  @IsNumber()
  maxEntries: number;

  @ApiProperty({
    type: Object,
    description:
      'A collection of features included in this plan. Each feature is represented as a key-value pair, where the key is the feature name and the value indicates whether the feature is enabled.',
    example: {
      prioritySupport: true,
      customBranding: false,
      unlimitedIntegrations: true,
    },
  })
  @IsObject()
  features: any;
}
