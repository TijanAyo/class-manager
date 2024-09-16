import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class loginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}
