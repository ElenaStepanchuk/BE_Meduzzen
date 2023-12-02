import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
