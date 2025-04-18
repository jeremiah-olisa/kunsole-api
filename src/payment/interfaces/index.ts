import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { KeysetPaginationParams } from "src/common/entities/pagination.entity";
import { KeysetPaginationDirection } from "src/common/interfaces/pagination.interface";

export class PaymentFilters {
    @ApiPropertyOptional({
        description: 'Filter by user ID',
        example: 'user_12345',
    })
    userId?: string;

    @ApiPropertyOptional({
        description: 'Filter by app ID',
        example: 'app_98765',
    })
    appId?: string;

    @ApiPropertyOptional({
        description: 'Filter by payment status',
        enum: PaymentStatus,
        example: PaymentStatus.COMPLETED,
    })
    status?: PaymentStatus;

    @ApiPropertyOptional({
        description: 'Filter by payment provider',
        enum: PaymentProvider,
        example: PaymentProvider.PAYSTACK,
    })
    provider?: PaymentProvider;
}

export class PaymentQuery implements PaymentFilters, KeysetPaginationParams {
    @ApiPropertyOptional({
        description: 'Filter by user ID',
        example: 'user_12345',
    })
    userId?: string;

    @ApiPropertyOptional({
        description: 'Filter by app ID',
        example: 'app_98765',
    })
    appId?: string;

    @ApiPropertyOptional({
        description: 'Filter by payment status',
        enum: PaymentStatus,
        example: PaymentStatus.COMPLETED,
    })
    status?: PaymentStatus;

    @ApiPropertyOptional({
        description: 'Filter by payment provider',
        enum: PaymentProvider,
        example: PaymentProvider.PAYSTACK,
    })
    provider?: PaymentProvider;

    @ApiPropertyOptional({
        description: 'The cursor for pagination',
        example: 'cursor_12345',
    })
    cursor?: string;

    @ApiPropertyOptional({
        description: 'The limit for pagination',
        example: 10,
    })
    limit?: number;

    @ApiPropertyOptional({
        description: 'Pagination direction (forward or backward)',
        enum: KeysetPaginationDirection,
        example: 'forward',
    })
    direction: KeysetPaginationDirection;

    getFilters() {
        return {
            appId: this.appId,
            provider: this.provider,
            status: this.status,
            userId: this.userId
        } as PaymentFilters;
    }

    getPagination(): KeysetPaginationParams {
        return {
            cursor: this.cursor,
            direction: this.direction,
            limit: this.limit,
        } as KeysetPaginationParams;
    }
}