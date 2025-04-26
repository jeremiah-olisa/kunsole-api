import { Injectable } from '@nestjs/common';
import { ICacheProvider } from '../interfaces/cache-provider.interface';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisProvider implements ICacheProvider {
    private client: RedisClientType;

    constructor(private configService: ConfigService) {
        try {
            this.client = createClient({
                url: this.configService.get('REDIS_URL'),
            });
            this.client.connect();
        } catch (error) {
            console.log('Redis connection error:', error);
        }
    }

    async exists(key: string): Promise<boolean> {
        const data = await this.client.exists(key);

        return Boolean(data);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.client.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async flush(): Promise<void> {
        await this.client.flushAll();
    }
}