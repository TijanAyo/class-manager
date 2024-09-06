import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RepositoryModule } from '../repository';

@Module({
  imports: [RepositoryModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
