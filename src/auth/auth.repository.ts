import { Injectable } from '@nestjs/common';
import { User, AuthProvider } from '@prisma/client';
import { OAuthUserPayload } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    fullName: string;
    password: string;
    provider: AuthProvider;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    return Boolean(await this.prisma.user.count({ where: { email } }));
  }

  async findUserByUserKey(userKey: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userKey } });
  }

  async updateRefreshToken(
    userKey: string,
    refreshToken: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { userKey },
      data: { refreshToken },
    });
  }

  async findOrCreateOAuthUser(
    payload: OAuthUserPayload,
    provider: AuthProvider,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
        provider,
      },
    });

    if (user) return user;

    return this.prisma.user.create({
      data: {
        email: payload.email,
        fullName: payload.fullName,
        provider,
        providerId: payload.providerId,
        profileImage: payload.profileImage,
      },
    });
  }

  async validateApiKeys(
    publicKey: string,
    secretKey: string,
  ): Promise<boolean> {
    const app = await this.prisma.app.findUnique({
      where: { publicKey },
      select: { secretKey: true },
    });

    if (!app) return false;

    return bcrypt.compare(secretKey, app.secretKey);
  }
}
