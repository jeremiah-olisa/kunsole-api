import { Injectable } from '@nestjs/common';
import { CacheProvider, ICacheProvider } from '../interfaces/cache-provider.interface';
import { RedisProvider } from './redis.provider';
import { MemoryProvider } from './memory.provider';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { getClassName } from 'src/common/utils';

@Injectable()
export class CacheProviderFactory {
    constructor(
        private readonly configService: ConfigService,
        private readonly moduleRef: ModuleRef,
    ) { }

    getProvider(driver?: CacheProvider): ICacheProvider {
        driver ??= this.configService.get<CacheProvider>('CACHE_DRIVER', CacheProvider.MEMORY);

        switch (driver.toLocaleUpperCase()) {
            case CacheProvider.REDIS:
                return this.moduleRef.get<RedisProvider>(RedisProvider, { strict: false });
            case CacheProvider.MEMORY:
                return this.moduleRef.get<MemoryProvider>(MemoryProvider, { strict: false });
            default:
                throw new Error(`Unsupported cache driver: ${driver}`);
        }
    }
}