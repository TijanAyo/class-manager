import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() payload: createUserDto) {
    return await this.authService.register(payload);
  }

  @Post('login')
  async login() {}

  @Post('forgot-password')
  async forgotPassword() {}
}
