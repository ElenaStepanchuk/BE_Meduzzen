import { IsEmail, IsString } from 'class-validator';
import { Auth } from 'src/auth/entities/auth.entity';
import { Company } from 'src/company/entities/company.entity';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  photo: string;

  auth: Auth;

  companies: Company[];
}
