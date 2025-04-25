import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { App as PrismaApp, Plan, UserApp } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class AppEntity implements PrismaApp {
  @ApiHideProperty()
  @Exclude()
  id: string;

  @ApiProperty({
    example: 'kunsole_pk_a1b2c3d4e5f6g7h8',
    description: 'Public API key',
  })
  publicKey: string;

  @ApiProperty({
    example: 'kunsole_sk_x1y2z3a4b5c6d7e8f9g0',
    description: 'Secret API key (only returned during creation/rotation)',
  })
  secretKey: string;

  @ApiProperty({ example: 'My Awesome App', description: 'App name' })
  name: string;

  @ApiProperty({
    example: 'My application description',
    description: 'App description',
    required: false,
  })
  description: string | null;

  @ApiProperty({ example: true, description: 'App active status' })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Plan ID' })
  planId: string;

  // @ApiProperty({ type: Plan, required: false })
  plan: Plan | null;

  // @ApiProperty({ type: [UserApp], required: false })
  userApp?: UserApp[] | null;

  constructor(partial: Partial<AppEntity>) {
    Object.assign(this, partial);
  }
}

export class PaginatedAppResult extends PaginatedResult<AppEntity> {
  @ApiProperty({ type: [AppEntity] })
  declare data: AppEntity[];
}
