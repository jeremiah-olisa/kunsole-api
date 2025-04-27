import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repositories/user.repository';
import { AuthProvider, User } from '@prisma/client';
import { OAuthUserPayload } from './interfaces/auth.interface';
import { Request } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dtos/register.dto';
import { AuthenticationUserResponseDto } from './dtos/authentication-user-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      provider: AuthProvider.PASSWORD,
    });

    return this.login(user);
  }

  async login(user: User): Promise<AuthenticationUserResponseDto> {
    return this.generateTokens(user);
  }

  async googleLogin(userEntity: UserEntity): Promise<AuthenticationUserResponseDto> {
    this.validateUserEntityOrThrow(userEntity);

    const user = await this.userService.findOrCreateOAuthUser(
      userEntity as OAuthUserPayload,
      AuthProvider.GOOGLE,
    );

    return this.generateTokens(user);
  }

  async githubLogin(userEntity: UserEntity): Promise<AuthenticationUserResponseDto> {
    this.validateUserEntityOrThrow(userEntity);

    const user = await this.userService.findOrCreateOAuthUser(
      userEntity as OAuthUserPayload,
      AuthProvider.GITHUB,
    );

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthenticationUserResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserByUserKey(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (user && user.provider === AuthProvider.PASSWORD) {
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    }

    return null;
  }

  async validateUserByUserKey(userKey: string): Promise<User | null> {
    return this.userService.findUserByUserKey(userKey);
  }


  async validateApiKey(publicKey: string, secretKey: string): Promise<boolean> {
    // Check if the app exists by public key
    const appSecretKey = await this.userService.getSecretKeyForValidationByPublicKey(publicKey);


    // Compare the provided secret key with the stored hashed secret key
    return bcrypt.compare(secretKey, appSecretKey);
  }

  async validateOAuthUser(
    userData: OAuthUserPayload,
    provider: AuthProvider,
  ): Promise<User> {
    return this.userService.findOrCreateOAuthUser(userData, provider);
  }

  private validateUserEntityOrThrow(userEntity: UserEntity) {
    if (userEntity) return;

    throw new UnauthorizedException('No user from Google');
  }

  private async generateTokens(user: User): Promise<AuthenticationUserResponseDto> {
    const payload: JwtPayload = {
      sub: user.userKey,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.updateRefreshToken(user.userKey, refreshToken);

    return {
      user: {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}
