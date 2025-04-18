import { AuthProvider, User, UserRole } from '@prisma/client';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UnauthorizedException } from '@nestjs/common';

export class UserEntity implements User {
    constructor(partial?: Partial<User>) {
        Object.assign(this, partial);
    }

    @Exclude()
    @ApiHideProperty()
    id: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    fullName: string;

    @ApiProperty({ description: 'Unique user key' })
    userKey: string;

    @Exclude()
    @ApiHideProperty()
    password: string | null;

    @ApiProperty({ enum: AuthProvider, description: 'Authentication provider' })
    provider: AuthProvider;

    @ApiProperty({ required: false, description: 'Provider ID for OAuth' })
    providerId: string | null;

    @ApiProperty({ required: false, description: 'Profile image URL' })
    profileImage: string | null;

    @ApiProperty({ enum: UserRole, description: 'User role' })
    role: UserRole;

    @ApiProperty({ required: false, description: 'Last login timestamp' })
    lastLogin: Date | null;

    @Exclude()
    @ApiHideProperty()
    refreshToken: string | null;

    @ApiProperty({ description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updatedAt: Date;

    getUserId() {
        if (!this.id) throw new UnauthorizedException('Invalid User Id')

        return this.id;
    }
}
