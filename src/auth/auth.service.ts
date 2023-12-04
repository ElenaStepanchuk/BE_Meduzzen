import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/types/Iresponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('AUTH SERVICE');
  }
  logger: Logger;

  async validateUser(
    email: string,
    pass: string,
  ): Promise<IResponse<User> | null> {
    try {
      const user = await this.userService.findOne(email);
      const { password } = user;
      const passwordIsMatch = await compare(pass, password);

      if (user && passwordIsMatch) {
        return {
          status_code: HttpStatus.OK,
          detail: user,
          result: `We added user token.`,
        };
      }
      return null;
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `Email or password not valid!`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async login(user: User): Promise<IResponse<string>> {
    try {
      const { id, email } = user;
      const token = await this.jwtService.sign({
        id,
        email,
      });
      return {
        status_code: HttpStatus.OK,
        detail: token,
        result: `We added user token.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Email or password not valid.',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
