import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService  implements OnModuleInit, OnModuleDestroy {
    private client : Redis;
    onModuleInit() {
        this.client = new Redis({
            host : process.env.REDIS_HOST || 'localhost',
            port : Number(process.env.REDIS_PORT) || 6379,
        })
        this.client.on('connect' , () => console.log("Redis connected successfully!"));
        this.client.on('error' , (err) => console.error("Redis connection error:", err));
    }

    async setOtp(email: string, otp: string, ttlSeconds = 300) {
      await this.client.set(`otp:${email}`, otp, 'EX', ttlSeconds);
    }

    async getOtp(email: string): Promise<string | null> {
        return this.client.get(`otp:${email}`);
    }

    async deleteOtp(email: string) {
        await this.client.del(`otp:${email}`);
    }

    onModuleDestroy() {
        this.client.quit();
    }
}
