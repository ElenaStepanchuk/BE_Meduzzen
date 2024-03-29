import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsAlphanumeric,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsAlphanumeric()
  @MinLength(6)
  @MaxLength(10)
  @IsNotEmpty()
  password: string;
}
