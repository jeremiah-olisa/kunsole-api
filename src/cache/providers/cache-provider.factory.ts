import { Injectable } from '@nestjs/common';
import { CacheProvider, ICacheProvider } from '../interfaces/cache-provider.interface';
import { RedisProvider } from './redis.provider';
import { MemoryProvider } from './memory.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheProviderFactory {
    constructor(
        private configService: ConfigService,
        private redisProvider: RedisProvider,
        private memoryProvider: MemoryProvider,
    ) { }

    getProvider(driver?: CacheProvider): ICacheProvider {
        driver ??= this.configService.get<CacheProvider>('CACHE_DRIVER', CacheProvider.MEMORY);

        switch (driver.toLocaleUpperCase()) {
            case CacheProvider.REDIS:
                return this.redisProvider;
            case CacheProvider.MEMORY:
                return this.memoryProvider;
            default:
                throw new Error(`Unsupported cache driver: ${driver}`);
        }
    }
}