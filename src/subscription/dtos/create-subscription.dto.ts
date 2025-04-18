import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class CreateSubscriptionDto {
    @ApiProperty({
        description: 'ID of the app being subscribed to',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString()
    @IsNotEmpty()
    appId: string;

    @ApiProperty({
        description: 'ID of the plan being subscribed to',
        example: '507f1f77bcf86cd799439012',
    })
    @IsString()
    @IsNotEmpty()
    planId: string;

    @ApiProperty({
        description: 'Amount being paid for the subscription (in smallest currency unit)',
        example: 10000, // 100.00 in currency
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        enum: PaymentProvider,
        description: 'Payment provider to use',
        example: PaymentProvider.PAYSTACK,
    })
    @IsEnum(PaymentProvider)
    paymentProvider: PaymentProvider;
}