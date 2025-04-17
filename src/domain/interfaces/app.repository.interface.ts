import { App, Plan } from './../../infrastructure/prisma/client';

export type AppWithPlan = App & { plan: Plan };

export interface IAppRepository {
  // Key-based authentication methods
  findByPublicKey(publicKey: string): Promise<AppWithPlan | null>;
  validateAppCredentials(
    publicKey: string,
    secretKey: string
  ): Promise<AppWithPlan | null>;
  validateAppCredentialsOrThrow(
    publicKey: string,
    secretKey: string
  ): Promise<AppWithPlan>;
  areCredentialsValid(publicKey: string, secretKey: string): Promise<boolean>;

  // App management
  createApp(data: {
    name: string;
    planId: string;
  }): Promise<{ app: App; secretKey: string }>;
  findById(id: string): Promise<AppWithPlan | null>;
  update(
    appId: string,
    data: Partial<App> & { secretKey?: string }
  ): Promise<App>;

  // Additional methods
  rotateKeys(appId: string): Promise<{ publicKey: string; secretKey: string }>;
  deactivateApp(appId: string): Promise<App>;
  activateApp(appId: string): Promise<App>;
  countActiveApps(): Promise<number>;
}