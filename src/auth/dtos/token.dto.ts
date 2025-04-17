import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    })
    accessToken: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token',
    })
    refreshToken: string;

    @ApiProperty({
        example: 3600,
        description: 'Expiration time in seconds',
    })
    expiresIn: number;
}