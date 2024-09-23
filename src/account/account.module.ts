import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { RepositoryModule } from '../repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [RepositoryModule, MailModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
