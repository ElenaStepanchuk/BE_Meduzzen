import { IsEmail } from 'class-validator';
import { Auth } from 'src/auth/entities/auth.entity';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  auth: Auth;
}
