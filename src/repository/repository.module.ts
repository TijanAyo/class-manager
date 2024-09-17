import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { PrismaModule } from '../prisma';
import { RedisRepositoryService } from './redis-repository/redis-repository.service';
import { RedisModule } from '../redis';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UserRepositoryService, RedisRepositoryService],
  exports: [UserRepositoryService, RedisRepositoryService],
})
export class RepositoryModule {}
