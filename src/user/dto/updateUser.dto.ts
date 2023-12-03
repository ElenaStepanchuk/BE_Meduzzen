import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;
}
