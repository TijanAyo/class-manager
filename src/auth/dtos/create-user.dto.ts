import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @ValidateNested()
  @Type(() => GuardianInfomation)
  @IsOptional()
  guardianInformation?: GuardianInfomation;
}

class GuardianInfomation {
  @IsString()
  @IsOptional()
  guardianFirstName?: string;

  @IsString()
  @IsOptional()
  guardianLastName?: string;

  @IsString()
  @IsOptional()
  guardianPhoneNumber?: string;

  @IsString()
  @IsOptional()
  guardianAddress?: string;
}
