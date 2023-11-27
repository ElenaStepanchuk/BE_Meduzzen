import { User } from 'src/user/entities/user.entity';

export interface IResponse {
  status_code: number;
  detail: string | User[] | User;
  result: string;
}
