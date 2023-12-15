import { Auth } from 'src/auth/entities/auth.entity';

export class UpdateUserDto {
  email: string;

  first_name: string;

  last_name: string;

  photo: string;

  auth: Auth;
}
