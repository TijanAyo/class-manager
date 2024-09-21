import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RepositoryModule } from './repository/repository.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RepositoryModule,
    MailModule,
    RedisModule,
    AccountModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
