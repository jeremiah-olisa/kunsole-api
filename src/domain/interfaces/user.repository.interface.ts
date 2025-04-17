import { UserRole } from './../../infrastructure/prisma/client';
import { User } from '../entities/user.entity';

export interface UserFilters {
  role?: UserRole;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface IUserRepository {
  create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByExternalId(appId: string, externalUserId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  listUsersByApp(appId: string, filters?: UserFilters): Promise<User[]>;
  countUsersByApp(appId: string): Promise<number>;
  updateRole(userId: string, role: UserRole): Promise<User>;
  findOrCreate(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    externalUserId: string,
    apiKey: string,
  ): Promise<User>;
}
