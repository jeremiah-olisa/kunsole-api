import { Entry as IEntry } from '@prisma/client';

export class Entry implements IEntry {
  id: string;
  type: 'EMAIL' | 'SMS' | 'TERMINAL';
  content: string;
  metadata: any | null;
  userId: string;
  createdAt: Date;
  readAt: Date | null;
  appId: string;

  constructor(partial: Partial<IEntry>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }

  markAsRead() {
    this.readAt = new Date();
  }
}
