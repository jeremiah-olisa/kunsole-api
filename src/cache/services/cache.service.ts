import { Injectable } from '@nestjs/common';
import { CacheProviderFactory } from '../providers/cache-provider.factory';
import { ICacheProvider } from '../interfaces/cache-provider.interface';

@Injectable()
export class CacheService implements ICacheProvider {
    constructor(private providerFactory: CacheProviderFactory) { }

    private get provider() {
        return this.providerFactory.getProvider();
    }

    async get<T>(key: string): Promise<T | null> {
        return this.provider.get<T>(key);
    }

    async exists(key: string): Promise<boolean> {
        return this.provider.exists(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        return this.provider.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        return this.provider.del(key);
    }

    async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached) return cached;

        const result = await callback();
        await this.set(key, result, ttl);
        return result;
    }

    async flush(): Promise<void> {
        return this.provider.flush();
    }
}