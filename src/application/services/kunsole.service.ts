import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IEntryRepository } from 'src/domain/interfaces/entry.repository.interface';
import { Entry } from '../../domain/entities/entry.entity';
import { IAppRepository } from 'src/domain/interfaces/app.repository.interface';

@Injectable()
export class KunsoleService {
  constructor(
    @Inject('IEntryRepository') private readonly entryRepository: IEntryRepository,
    @Inject('IAppRepository') private readonly appRepository: IAppRepository,
  ) { }

  async logEntry(
    entry: Omit<Entry, 'id' | 'createdAt' | 'readAt' | 'markAsRead'>,
  ): Promise<Entry> {
    const app = await this.appRepository.validateAppApiKeyOrThrow(entry.appId);

    // Check entry limits against app's plan
    const entriesCount = await this.entryRepository.countRecentEntries(app.id);
    if (app.plan.maxEntries > 0 && entriesCount >= app.plan.maxEntries) {
      throw new BadRequestException('Entry limit reached for current plan');
    }

    const newEntry = new Entry({
      ...entry,
      appId: app.id,
    });
    return this.entryRepository.createEntry(newEntry);
  }

  async getEntriesForUser(userId: string, filters?: any): Promise<Entry[]> {
    return this.entryRepository.findEntriesByUserId(userId, filters);
  }

  async findEntriesByAppKey(appKey: string, filters?: any): Promise<Entry[]> {
    var isValid = await this.appRepository.isApiKeyValid(appKey);

    if (!isValid)
      throw new BadRequestException('Invalid Api Key');

    return this.entryRepository.findEntriesByAppKey(appKey, filters);
  }

  async markEntryAsRead(entryId: string): Promise<Entry> {
    return this.entryRepository.markEntryAsRead(entryId);
  }
}
