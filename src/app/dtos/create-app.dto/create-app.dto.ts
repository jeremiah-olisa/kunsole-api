import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateAppDto {
    @ApiProperty({
        example: 'My Awesome App',
        description: 'Application name',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 'Description of my app',
        description: 'Application description',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Plan ID for the application',
    })
    @IsOptional()
    @IsString()
    planId?: string;
}