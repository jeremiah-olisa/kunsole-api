import { ApiProperty } from '@nestjs/swagger';
import { AppUserRole } from '@prisma/client';
import { PaginatedResult } from 'src/common/entities/pagination.entity';

export class UserAppResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user-app relationship record.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the application the user is associated with.',
    example: 'app-987654321',
  })
  appId: string;

  @ApiProperty({
    description: 'ID of the user associated with the application.',
    example: 'user-123456789',
  })
  userId: string;

  @ApiProperty({
    description: 'Role of the user within the application.',
    enum: AppUserRole,
    example: AppUserRole.ADMIN, // adjust based on actual enum values
  })
  role: AppUserRole;

  @ApiProperty({
    description: 'Timestamp when the user-app association was created.',
    example: '2025-04-15T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user-app association was last updated.',
    example: '2025-04-16T09:21:43.123Z',
  })
  updatedAt: Date;
}

export class PaginatedUserAppResponseDto extends PaginatedResult<UserAppResponseDto> {
  @ApiProperty({ type: [UserAppResponseDto] })
  declare data: UserAppResponseDto[];
}
