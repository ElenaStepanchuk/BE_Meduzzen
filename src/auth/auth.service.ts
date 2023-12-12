import {
  Injectable,
  Logger,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/types/Iresponse';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {
    this.logger = new Logger('AUTH SERVICE');
  }
  logger: Logger;

  async validateUser(
    email: string,
    pass: string,
  ): Promise<IResponse<User> | null> {
    try {
      const user = await this.userService.findOneByEmail(email);
      const { password } = user.detail;
      const passwordIsMatch = await compare(pass, password);

      if (user && passwordIsMatch) {
        return {
          status_code: HttpStatus.OK,
          detail: user.detail,
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

  // registration new user
  async register(
    createUserDto: CreateUserDto,
  ): Promise<IResponse<User> | null> {
    try {
      const user = await this.userService.createUser({ ...createUserDto });

      const { id, email } = user.detail;
      const tokens = await this.getTokens(id, email);
      this.logger.warn('tokens', tokens);

      await this.authRepository.save({
        ...user.detail,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
        user_id: user.detail.id,
      });

      return user;
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

  // Login user
  async login(createUserDto: CreateUserDto): Promise<IResponse<object> | null> {
    try {
      const checkUser = await this.userService.findOneByEmail(
        createUserDto.email,
      );

      if (!checkUser) throw new NotFoundException('User does not exist');
      const { id, email, password } = checkUser.detail;
      const passwordIsMatch = await compare(createUserDto.password, password);

      if (!passwordIsMatch)
        throw new UnauthorizedException('Email or password not valid!');

      const tokens = await this.getTokens(id, email);

      await this.authRepository.update(id, {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
      });

      this.logger.warn('tokens', tokens);
      return {
        status_code: HttpStatus.OK,
        detail: { ...checkUser.detail, tokens },
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

  // logout user
  async logout(user_id: number): Promise<IResponse<boolean>> {
    try {
      await this.authRepository.update(user_id, {
        refresh_token: null,
        action_token: null,
        access_token: null,
      });
      return {
        status_code: HttpStatus.OK,
        detail: true,
        result: `User Logouted.`,
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

  async getTokens(id: number, email: string): Promise<any> {
    try {
      const accessToken = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACCESS'),
          expiresIn: '15m',
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
          expiresIn: '1d',
        },
      );
      const actionToken = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACTION'),
          expiresIn: '1d',
        },
      );

      return {
        accessToken,
        refreshToken,
        actionToken,
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

  async refreshTokens(token: string): Promise<any> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET_ACCESS');
      const decodedToken = jwt.verify(token, secret) as
        | { id: number; email: string }
        | string;
      this.logger.warn('decodedToken', decodedToken);

      if (typeof decodedToken === 'string') {
        throw new ForbiddenException('Access Denied');
      }

      const { id, email } = decodedToken;
      const user = await this.userService.getUserById(id);

      if (!user) throw new ForbiddenException('Access Denied');

      const tokens = await this.getTokens(id, email);
      this.logger.warn('tokens', tokens);

      await this.authRepository.update(id, {
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
        access_token: tokens.accessToken,
      });

      return tokens;
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
