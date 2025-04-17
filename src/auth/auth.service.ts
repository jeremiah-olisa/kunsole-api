// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, User } from 'src/infrastructure/prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import crypto from 'crypto';
import { IUserRepository } from 'src/domain/interfaces/user.repository.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.password &&
            await this.userRepository.comparePassword(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: { email: string; password: string }): Promise<LoginResponseDto> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: await this.generateRefreshToken(user.id),
            expires_in: 3600,
            token_type: 'Bearer',
        };
    }

    async validateOAuthUser(oauthUser: {
        email: string;
        username?: string;
        firstName?: string;
        picture?: string;
        refreshToken?: string;
        provider: AuthProvider;
        id?: string;
    }): Promise<LoginResponseDto> {
        // Generate a random secure userKey for identification
        const userKey = crypto.randomBytes(16).toString('hex');

        // Create or update the user
        const user = await this.userRepository.findOrCreate({
            email: oauthUser.email,
            fullName: oauthUser.username || oauthUser.firstName || oauthUser.email.split('@')[0],
            profileImage: oauthUser.picture || this.generateDefaultAvatar(oauthUser.email),
            provider: oauthUser.provider,
            providerId: oauthUser.id || crypto.randomUUID(),
            userKey,
            password: null, // OAuth users don't need password
            permissions: this.getDefaultPermissions(oauthUser.provider),
            lastLogin: new Date(),
            refreshToken: oauthUser.refreshToken ?? null,
        });

        // Generate tokens
        return this.login({
            email: user.email,
            password: '', // Not used for OAuth
        });
    }

    // Helper methods:
    private generateDefaultAvatar(email: string): string {
        // Generate a deterministic avatar URL based on email
        const hash = crypto.createHash('md5').update(email).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    }

    private getDefaultPermissions(provider: AuthProvider): string[] {
        // Grant basic permissions by default
        const basePermissions = ['read:profile', 'write:profile'];

        // Additional permissions for certain providers
        // if (provider === 'GOOGLE') {
        //     basePermissions.push('import:contacts');
        // }

        return basePermissions;
    }


    private async generateRefreshToken(userId: string): Promise<string> {
        const payload = { sub: userId };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
    }
}