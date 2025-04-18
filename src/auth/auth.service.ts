import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { UserEntity } from '../user/entities/user.entity';
import { AuthProvider, User } from '@prisma/client';
import { OAuthUserPayload } from './interfaces/auth.interface';
import { Request } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dtos/register.dto';
import { TokenDto } from './dtos/token.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository,
    ) { }

    async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.authRepository.createUser({
            ...registerDto,
            password: hashedPassword,
            provider: AuthProvider.PASSWORD,
        });
    }

    async login(user: User): Promise<TokenDto> {
        return this.generateTokens(user);
    }

    async googleLogin(req: Request): Promise<TokenDto> {
        if (!req.user) {
            throw new UnauthorizedException('No user from Google');
        }

        const user = await this.authRepository.findOrCreateOAuthUser(
            req.user as OAuthUserPayload,
            AuthProvider.GOOGLE,
        );

        return this.generateTokens(user);
    }

    async githubLogin(req: Request): Promise<TokenDto> {
        if (!req.user) {
            throw new UnauthorizedException('No user from GitHub');
        }

        const user = await this.authRepository.findOrCreateOAuthUser(
            req.user as OAuthUserPayload,
            AuthProvider.GITHUB,
        );

        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string): Promise<TokenDto> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.authRepository.findUserByUserKey(payload.sub);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            return this.generateTokens(user);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.authRepository.findUserByEmail(email);

        if (user && user.provider === AuthProvider.PASSWORD) {
            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null;
        }

        return null;
    }

    async validateUserByUserKey(userKey: string): Promise<User | null> {
        return this.authRepository.findUserByUserKey(userKey);
    }

    async validateApiKey(publicKey: string, secretKey: string): Promise<boolean> {
        return this.authRepository.validateApiKeys(publicKey, secretKey);
    }

    async validateOAuthUser(userData: OAuthUserPayload, provider: AuthProvider): Promise<User> {
        return this.authRepository.findOrCreateOAuthUser(userData, provider);
    }

    private async generateTokens(user: User): Promise<TokenDto> {
        const payload: JwtPayload = {
            sub: user.userKey,
            email: user.email,
            role: user.role
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.authRepository.updateRefreshToken(user.userKey, refreshToken);

        return {
            accessToken,
            refreshToken,
            expiresIn: 3600 // 1 hour in seconds
        };
    }
}