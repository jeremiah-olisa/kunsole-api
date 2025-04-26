import { Injectable } from '@nestjs/common';
import { User, AuthProvider } from '@prisma/client';
import { OAuthUserPayload } from '../../auth/interfaces/auth.interface';
import { PrismaService } from 'nestjs-prisma';
import { ICreateUserPayload } from '../interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(data: ICreateUserPayload): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserIdByEmail(email: string) {
    const result = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });

    return result?.id;
  }

  async getUserNameById(id: string) {
    const result = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id },
          { userKey: id }
        ],
      },
      select: { id: true, fullName: true },
    });

    return result;
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

  async getSecretKeyForValidationByPublicKey(publicKey: string): Promise<string | null> {
    const app = await this.prisma.app.findUnique({
      where: { publicKey },
      select: { secretKey: true },
    });

    return app?.secretKey ?? null;
  }
}
