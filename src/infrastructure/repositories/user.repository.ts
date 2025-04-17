import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IUserRepository,
  UserFilters,
} from '../../domain/interfaces/user.repository.interface';
import { User, UserRole } from './../../infrastructure/prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    externalUserId: string,
    apiKey: string,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: { externalUserId, app: { apiKey: apiKey } },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        ...userData,
        externalUserId,
        app: { connect: { apiKey } },
        permissions: [],
        appId: undefined, // Ensure appId is not included
      },
    });
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userData,
        permissions: userData.permissions || [],
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { app: true },
    });
  }

  async findByExternalId(
    appId: string,
    externalUserId: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        appId,
        externalUserId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async listUsersByApp(appId: string, filters?: UserFilters): Promise<User[]> {
    const where: any = { appId };

    if (filters) {
      if (filters.role) where.role = filters.role;
      if (filters.searchTerm) {
        where.OR = [
          {
            externalUserId: {
              contains: filters.searchTerm,
              mode: 'insensitive',
            },
          },
          { email: { contains: filters.searchTerm, mode: 'insensitive' } },
        ];
      }
    }

    const take = filters?.limit || 10;
    const skip = filters?.page ? (filters.page - 1) * take : 0;

    return this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUsersByApp(appId: string): Promise<number> {
    return this.prisma.user.count({
      where: { appId },
    });
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
