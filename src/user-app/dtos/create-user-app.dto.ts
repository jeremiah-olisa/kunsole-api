import { ApiProperty } from '@nestjs/swagger';
import { AppUserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserAppDto {
    @ApiProperty({
        description: 'Application ID',
        example: '507f1f77bcf86cd799439011',
    })
    @IsString()
    @IsNotEmpty()
    appId: string;

    @ApiProperty({
        description: 'User ID',
        example: '507f1f77bcf86cd799439012',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        enum: AppUserRole,
        example: AppUserRole.DEVELOPER,
    })
    @IsEnum(AppUserRole)
    role: AppUserRole;
}