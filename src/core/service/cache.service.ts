import * as LRU from 'lru-cache'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CacheService {

    private lruOptions: LRU.Options<any, any> = {
        max: 500,
        maxAge: 1000 * 60 * 5
    }

    private caches: LRU<any, any> = new LRU(this.lruOptions)

    get(key: string) {
        const data = this.caches.get(key);
        if (!data) return;
        return data;
    }

    set(key: string, value: any, seconds?: number) {
        if (!seconds) {
            this.caches.set(key, value, 0);
        } else {
            this.caches.set(key, value, seconds * 1000);
        }
    }

    del(key: string) {
        this.caches.del(key);
    }
    
}