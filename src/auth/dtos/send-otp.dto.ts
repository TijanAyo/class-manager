import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum REASON {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
}

export class sendOTPDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsEnum(REASON)
  @IsNotEmpty()
  reason: string;
}
