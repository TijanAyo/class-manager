import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

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

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

enum Role {
  Student = 'Student',
  Teacher = 'Teacher',
}

export class registerDto {
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

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  age: number;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ValidateNested()
  @Type(() => GuardianInfomation)
  @IsOptional()
  guardianInformation?: GuardianInfomation;
}
