import { Plan as IPlan, $Enums } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class Plan implements IPlan {
  constructor(partial: Partial<IPlan>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
  }

  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: $Enums.PlanType;
  description: string;
  price: number;
  maxApps: number;
  maxUsers: number;
  entryRetentionDays: number;
  maxEntries: number;
  features: JsonValue;
}
