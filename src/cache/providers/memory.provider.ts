import { Injectable } from '@nestjs/common';
import { ICacheProvider } from '../interfaces/cache-provider.interface';

@Injectable()
export class MemoryProvider implements ICacheProvider {
    private store = new Map<string, { value: any; expiresAt?: number }>();

    exists(key: string): Promise<boolean> {
        return this.store.has(key) ? Promise.resolve(true) : Promise.resolve(false);
    }

    async get<T>(key: string): Promise<T | null> {
        const item = this.store.get(key);
        if (!item) return null;

        if (item.expiresAt && item.expiresAt < Date.now()) {
            await this.del(key);
            return null;
        }

        return item.value;
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        const expiresAt = ttl ? Date.now() + ttl * 1000 : undefined;
        this.store.set(key, { value, expiresAt });
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
    }

    async flush(): Promise<void> {
        this.store.clear();
    }
}