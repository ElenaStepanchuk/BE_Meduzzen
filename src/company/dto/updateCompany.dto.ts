import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './createCompany.dto';
import { User } from 'src/user/entities/user.entity';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  company_name: string;

  company_description: string;

  visibility: boolean;

  users: User[];
}
