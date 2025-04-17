import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export interface IKeysetPaginationParams {
    cursor?: string;
    limit?: number;
    direction?: 'forward' | 'backward';
}

export interface IPaginatedResult<T> {
    data: T[];
    nextCursor?: string;
    prevCursor?: string;
    total: number;
}

export class PaginatedResult<T> {
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
