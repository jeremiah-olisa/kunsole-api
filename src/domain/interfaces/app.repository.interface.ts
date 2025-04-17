import { Prisma } from 'src/infrastructure/prisma/client';
import { App, AppWithPlanEntries } from '../entities/app.entity';

export interface IAppRepository {
  findByPublicKey(publicKey: string): Promise<App>;
  validateAppApiKey(key: string): Promise<AppWithPlanEntries | null>;
  validateAppApiKeyOrThrow(key: string): Promise<AppWithPlanEntries>;
  isApiKeyValid(key: string): Promise<boolean>;
  createApp(app: Prisma.XOR<Prisma.AppCreateInput, Prisma.AppUncheckedCreateInput>): Promise<App>;
  findById(id: string): Promise<App | null>;
  update(appId: string, data: Partial<App>): Promise<void>;
}
