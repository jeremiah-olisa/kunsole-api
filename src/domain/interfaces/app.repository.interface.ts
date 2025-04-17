import { App, AppWithPlanEntries } from '../entities/app.entity';

export interface IAppRepository {
  validateAppApiKey(key: string): Promise<AppWithPlanEntries | null>;
  validateAppApiKeyOrThrow(key: string): Promise<AppWithPlanEntries>;
  isApiKeyValid(key: string): Promise<boolean>;
  createApp(name: string, planId: string): Promise<App>;
  findById(id: string): Promise<App | null>;
}
