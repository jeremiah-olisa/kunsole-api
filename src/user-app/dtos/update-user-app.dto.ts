import { ApiProperty } from '@nestjs/swagger';
import { AppUserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserAppDto {
  @ApiProperty({
    enum: AppUserRole,
    example: AppUserRole.ADMIN,
    required: false,
  })
  @IsEnum(AppUserRole)
  @IsNotEmpty()
  role: AppUserRole;
}
