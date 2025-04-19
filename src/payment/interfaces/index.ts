import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { KeysetPaginationParams } from "src/common/entities/pagination.entity";
import { KeysetPaginationDirection } from "src/common/interfaces/pagination.interface";

export interface PaymentFilters {
    userId?: string;
    appId?: string;
    status?: PaymentStatus;
    provider?: PaymentProvider;
}

export class PaymentQuery extends KeysetPaginationParams implements PaymentFilters {
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

    getFilters(): PaymentFilters {
        const {
            getFilters,
            getPagination, cursor,
            limit,
            direction, ...filters } = this;

        return filters;

    }

    getPagination(): KeysetPaginationParams {
        return {
            cursor: this.cursor,
            direction: this.direction,
            limit: this.limit,
        } as KeysetPaginationParams;
    }
}