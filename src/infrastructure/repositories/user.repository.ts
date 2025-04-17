// src/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository, UserFilters } from 'src/domain/interfaces/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '../prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userData,
        password: userData.password ? await this.hashPassword(userData.password) : undefined,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByExternalId(appId: string, externalUserId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        appId,
        externalUserId,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }
    return this.prisma.user.update({
      where: { id },
      data: updates,
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
          { email: { contains: filters.searchTerm, mode: 'insensitive' } },
          { fullName: { contains: filters.searchTerm, mode: 'insensitive' } },
        ];
      }
    }

    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: filters?.skip,
      take: filters?.take,
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

  async findOrCreate(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) return existingUser;

    return this.create(userData);
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}