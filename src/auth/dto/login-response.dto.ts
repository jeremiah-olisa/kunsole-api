// src/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    })
    access_token: string;
    
    
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token',
    })
    refresh_token: string;

    @ApiProperty({
        example: '3600',
        description: 'Token expiration time in seconds',
    })
    expires_in: number;

    @ApiProperty({
        example: 'Bearer',
        description: 'Token type',
    })
    token_type: string;
}