import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsString,
} from 'class-validator';
import { EntryType } from '@prisma/client';
import { KeysetPaginationParams } from 'src/common/entities/pagination.entity';

export interface ListEntriesDto {
  type?: EntryType;
  fromDate?: string;
  toDate?: string;
  appId?: string;
  userId?: string;
  isRead?: boolean;
}

export class ListEntriesQuery
  extends KeysetPaginationParams
  implements ListEntriesDto
{
  @ApiPropertyOptional({
    description:
      'Filter entries by type. Possible values include "email", "sms", "terminal", etc.',
    enum: EntryType,
    example: EntryType.EMAIL,
  })
  @IsEnum(EntryType)
  @IsOptional()
  type?: EntryType;

  @ApiPropertyOptional({
    description:
      'Filter entries from this date onwards. Must be in ISO 8601 format (e.g., "2023-04-01T00:00:00Z")',
    example: '2023-04-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({
    description:
      'Filter entries up to this date. Must be in ISO 8601 format (e.g., "2023-04-30T23:59:59Z")',
    example: '2023-04-30T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiPropertyOptional({
    description:
      'Filter entries by the application ID. If not provided, returns entries for all apps.',
    example: 'app123',
  })
  @IsString()
  @IsOptional()
  appId?: string;

  @ApiPropertyOptional({
    description:
      'Filter entries by user ID. If not provided, returns entries for all users.',
    example: 'user123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description:
      'Filter entries by read status. If not provided, returns entries regardless of whether they are read or not.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  getFilters(): ListEntriesDto {
    const { getFilters, getPagination, cursor, limit, direction, ...filters } =
      this;

    return filters;
  }
  getPagination(): KeysetPaginationParams {
    return {
      cursor: this.cursor,
      limit: this.limit,
      direction: this.direction,
    };
  }
}
