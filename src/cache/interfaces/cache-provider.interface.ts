export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    exists(key: string): Promise<boolean>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    flush(): Promise<void>;
}

export enum CacheProvider {
    MEMORY = 'MEMORY',
    REDIS = 'REDIS',
}