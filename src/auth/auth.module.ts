import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RepositoryModule } from '../repository';
import { JwtModule } from '@nestjs/jwt';
import { constants } from '../common/utils/constant';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    RepositoryModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: constants.TTL },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
