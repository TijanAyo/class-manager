import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { RepositoryModule } from '../repository';

@Module({
  imports: [RepositoryModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
