import {
  IKeysetPaginationParams,
  IPaginatedResult,
  KeysetPaginationDirection,
} from '../interfaces/pagination.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class PaginatedResult<T> implements IPaginatedResult<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  @IsArray()
  data: T[];

  @ApiPropertyOptional({
    description: 'Cursor pointing to the next page of results',
    type: String,
  })
  @IsOptional()
  @IsString()
  nextCursor?: string;

  @ApiPropertyOptional({
    description: 'Cursor pointing to the previous page of results',
    type: String,
  })
  @IsOptional()
  @IsString()
  prevCursor?: string;

  @ApiProperty({
    description: 'Total number of items',
    type: Number,
  })
  @IsNumber()
  total: number;
}

export class KeysetPaginationParams implements IKeysetPaginationParams {
  @ApiPropertyOptional({
    description: 'Cursor for keyset pagination',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 20, max: 100)',
    example: 20,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Pagination direction (forward or backward)',
    enum: KeysetPaginationDirection,
    example: 'forward',
  })
  direction?: KeysetPaginationDirection;
}
