import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export class editProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsEnum(Gender)
  @IsOptional()
  gender: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  streetAddress: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
