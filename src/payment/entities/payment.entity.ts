import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Payment } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { PaginatedResult } from "src/common/entities/pagination.entity";

export class PaymentEntity implements Payment {
    @ApiProperty({
        description: 'Unique identifier for the payment',
        example: 'pay_01HXYZABC1234DEF',
    })
    id: string;

    @ApiProperty({
        description: 'Amount paid in the smallest unit of the currency (e.g., kobo, cents)',
        example: 5000,
    })
    amount: number;

    @ApiProperty({
        description: 'Currency in which the payment was made',
        example: 'NGN',
    })
    currency: string;

    @ApiProperty({
        description: 'Reference string from the payment provider',
        example: 'ref_abc123456',
    })
    reference: string;

    @ApiProperty({
        description: 'Payment provider used for the transaction',
        enum: $Enums.PaymentProvider,
        example: $Enums.PaymentProvider.PAYSTACK,
    })
    provider: $Enums.PaymentProvider;

    @ApiProperty({
        description: 'Current status of the payment',
        enum: $Enums.PaymentStatus,
        example: $Enums.PaymentStatus.COMPLETED,
    })
    status: $Enums.PaymentStatus;

    @ApiProperty({
        description: 'Additional metadata from the payment provider or app',
        example: { plan: 'pro', trial: false },
    })
    metadata: JsonValue;

    @ApiProperty({
        description: 'ID of the application this payment belongs to',
        example: 'app_1234567890',
    })
    appId: string;

    @ApiProperty({
        description: 'ID of the user who made the payment',
        example: 'user_9876543210',
    })
    userId: string;

    @ApiProperty({
        description: 'Date the payment was created',
        example: '2024-04-01T10:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Date the payment was last updated',
        example: '2024-04-01T12:00:00.000Z',
    })
    updatedAt: Date;

    constructor(partial: Partial<Payment>) {
        Object.assign(this, partial);
    }
}

export class PaginatedResultPaymentEntity extends PaginatedResult<PaymentEntity> {
    @ApiProperty({
        type: [PaymentEntity],
        isArray: true,
        description: 'Array of payment entities',
    })
    declare data: PaymentEntity[];
}