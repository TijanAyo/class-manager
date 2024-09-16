import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto, loginDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() payload: registerDto) {
    return await this.authService.register(payload);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() payload: loginDto) {
    return await this.authService.login(payload);
  }

  @Post('forgot-password')
  async forgotPassword() {}
}
