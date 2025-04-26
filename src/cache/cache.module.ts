import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { RedisProvider } from './providers/redis.provider';
import { MemoryProvider } from './providers/memory.provider';
import { CacheProviderFactory } from './providers/cache-provider.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [
        CacheService,
        RedisProvider,
        MemoryProvider,
        CacheProviderFactory,
        ConfigService,
    ],
    exports: [CacheService],
})
export class CacheModule { }