import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InitiatePaymentDto {

    @ApiProperty({
        description: 'The unique identifier of the application associated with this payment.',
        example: 'app-1234abcd5678efgh',
    })
    @IsString()
    @IsNotEmpty()
    appId: string;

    @ApiProperty({
        description: 'The unique identifier of the user making the payment.',
        example: 'user-1234567890',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'The unique identifier for the subscription that this payment is being made for.',
        example: 'sub-1234abcd5678efgh',
    })
    @IsString()
    @IsNotEmpty()
    subscriptionId: string;

    @ApiProperty({
        description: 'The amount to be paid for the subscription. Should be in the smallest unit (e.g., cents).',
        example: 1999,
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({
        description: 'The payment provider used for processing the payment. Example values: "PAYSTACK", "FLUTTERWAVE".',
        enum: PaymentProvider,
        example: 'PAYSTACK',
    })
    @IsEnum(PaymentProvider)
    @IsOptional()
    provider?: PaymentProvider;

    @ApiProperty({
        description: 'The email address of the user making the payment.',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
