import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto, loginDto, sendOTPDto } from './dtos';

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

  @Post('send-otp')
  @HttpCode(200)
  async sendOTP(@Body() payload: sendOTPDto) {
    return await this.authService.sendOTP(payload);
  }

  @Post('forgot-password')
  async forgotPassword() {}
}
