import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { RedisProvider } from './providers/redis.provider';
import { MemoryProvider } from './providers/memory.provider';
import { CacheProviderFactory } from './providers/cache-provider.factory';

@Module({
    providers: [
        CacheService,
        // RedisProvider,
        MemoryProvider,
        CacheProviderFactory,
    ],
    exports: [CacheService],
})
export class CacheModule { }