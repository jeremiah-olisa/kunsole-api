import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Valid email address of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user',
    })
    @IsString()
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
