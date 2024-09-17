import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import { constants } from '../common/utils';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

  constructor() {
    this.client = createClient({
      password: constants.REDIS_PASSWORD,
      socket: {
        host: constants.REDIS_HOST,
        port: Number(constants.REDIS_PORT),
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Redis client connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis client disconnected');
  }

  getClient() {
    return this.client;
  }
}
