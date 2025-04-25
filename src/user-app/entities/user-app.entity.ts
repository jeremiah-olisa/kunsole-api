import { ApiProperty } from '@nestjs/swagger';
import { $Enums, UserApp } from '@prisma/client';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class UserAppEntity implements UserApp {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Unique identifier for the user-app relation',
  })
  id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'ID of the related app',
  })
  appId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'ID of the related user',
  })
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user is active within the app',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date of the record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Last update date of the record',
  })
  updateAt: Date;

  @ApiProperty({
    enum: $Enums.AppUserRole,
    example: $Enums.AppUserRole.ADMIN,
    description: 'Role of the user within the app',
  })
  role: $Enums.AppUserRole;

  constructor(partial: Partial<UserAppEntity>) {
    Object.assign(this, partial);
  }
}

export class PaginatedUserAppResult extends PaginatedResult<UserAppEntity> {
  @ApiProperty({ type: [UserAppEntity] })
  declare data: UserAppEntity[];
}
