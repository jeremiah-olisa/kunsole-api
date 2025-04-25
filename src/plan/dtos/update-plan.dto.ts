import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    required: false,
    description:
      "The name of the plan. It can be updated to change the plan's display name.",
    example: 'Pro Plan',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description:
      'A detailed description of the plan, explaining its features and benefits.',
    example:
      'This plan includes advanced features for business growth and scalability.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'The price of the plan in USD (or relevant currency).',
    example: 99.99,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    required: false,
    description: 'The maximum number of apps that can be used under this plan.',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  maxApps?: number;

  @ApiProperty({
    required: false,
    description: 'The maximum number of users allowed under this plan.',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  maxUsers?: number;

  @ApiProperty({
    required: false,
    description:
      'The number of days the plan retains app entries. (Default: 30 days)',
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  entryRetentionDays?: number;

  @ApiProperty({
    required: false,
    description: 'The maximum number of entries allowed under this plan.',
    example: 5000,
  })
  @IsNumber()
  @IsOptional()
  maxEntries?: number;

  @ApiProperty({
    type: Object,
    required: false,
    description:
      'A collection of features included in this plan. Each feature is a key-value pair indicating whether the feature is enabled.',
    example: {
      prioritySupport: true,
      customBranding: false,
      unlimitedIntegrations: true,
    },
  })
  @IsObject()
  @IsOptional()
  features?: any;
}
