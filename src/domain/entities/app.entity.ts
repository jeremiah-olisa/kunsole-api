import { App as IApp } from './../../infrastructure/prisma/client';

export class App implements IApp {
  createdAt: Date;
  name: string;
  id: string;
  updatedAt: Date;
  isActive: boolean;
  planId: string;

  constructor(partial: Partial<IApp>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }
  publicKey: string;
  secretKey: string;
}

export interface AppWithPlanEntries {
  id: string;
  name: string;
  plan: {
    maxEntries: number;
  };
}
