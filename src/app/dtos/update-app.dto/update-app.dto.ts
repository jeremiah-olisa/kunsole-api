import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAppDto {
  @ApiProperty({
    example: 'My Updated App',
    description: 'Updated app name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Updated app description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'New plan ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  planId?: string;
}
