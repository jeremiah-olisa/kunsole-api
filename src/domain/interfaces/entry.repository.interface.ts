import { Entry } from '../entities/entry.entity';

export interface EntryFilters {
  type?: 'EMAIL' | 'SMS' | 'TERMINAL';
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export interface IEntryRepository {
  createEntry(entry: Entry): Promise<Entry>;
  findEntriesByUserId(userId: string, filters?: EntryFilters): Promise<Entry[]>;
  findEntriesByAppKey(appKey: string, filters?: EntryFilters): Promise<Entry[]>;
  markEntryAsRead(entryId: string): Promise<Entry>;
  countRecentEntries(appId: string): Promise<number>;
}
