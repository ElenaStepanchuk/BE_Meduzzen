import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IResponse } from 'src/types/Iresponse';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ValidateUserStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger = new Logger('CHANGING IN ValidateUserStrategy');
  }
  logger: Logger;
  async validate(email: string, password: string): Promise<IResponse<User>> {
    const user = await this.authService.validateUser(email, password);
    this.logger.warn('userValidate', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
