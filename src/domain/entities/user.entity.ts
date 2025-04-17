import { $Enums, User as IUser } from '@prisma/client';

export class User implements IUser {
  id: string;
  appId: string;
  externalUserId: string;
  email: string;
  role: $Enums.UserRole;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLogin: Date | null;
  fullName: string;
  password: string;
  profileImage: string | null;

  constructor(partial: Partial<IUser>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
}
