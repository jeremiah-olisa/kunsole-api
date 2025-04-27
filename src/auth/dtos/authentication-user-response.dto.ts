import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

type AuthenticationUser = Pick<UserEntity, 'email' | 'fullName' | 'profileImage' | 'role'>;

export class AuthenticationUserResponseDto {
  user: AuthenticationUser;

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
