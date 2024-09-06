import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register() {}

  @Post('login')
  async login() {}

  @Post('forgot-password')
  async forgotPassword() {}
}
