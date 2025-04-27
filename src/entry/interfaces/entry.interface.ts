import { EntryType } from '@prisma/client';

export interface IEntryFilters {
  type?: EntryType;
  fromDate?: Date;
  toDate?: Date;
  appId?: string;
  userId?: string;
  isRead?: boolean;
  search?: string;
  recipient?: string;
}
