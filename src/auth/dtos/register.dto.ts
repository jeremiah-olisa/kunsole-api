import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from 'src/common/decorators/database/unique.decorator';
import { User } from '@prisma/client';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Valid email address of the user',
    })
    @IsEmail()
    @Unique<User>({
        table: 'user',
        column: 'email',
        message: ({ value }) => `Email '${value}' already exists, please use a different one.`
    })
    email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @IsString()
    @MinLength(4)
    fullName: string;

    @ApiProperty({
        example: 'P@ssw0rd!',
        description: 'Password with minimum length of 8 characters',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    password: string;
}
