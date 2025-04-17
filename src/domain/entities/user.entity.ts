import { $Enums, User as IUser } from './../../infrastructure/prisma/client';

export class User implements IUser {

  constructor(partial: Partial<IUser>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
  id: string;
  email: string;
  fullName: string;
  userKey: string;
  password: string | null;
  provider: $Enums.AuthProvider;
  providerId: string | null;
  profileImage: string | null;
  permissions: string[];
  lastLogin: Date | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;

}
