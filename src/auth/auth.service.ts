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

import { JwtService } from '@nestjs/jwt';
import { IResponse } from 'src/types/Iresponse';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { GetTokens } from 'src/utils/getTokens.util';
import { DecodedToken } from 'src/utils/decodedToken.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
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

      const newTokens = new GetTokens(this.jwtService, this.configService);
      const tokens = (await newTokens.getTokens(id, email)) as {
        accessToken: string;
        refreshToken: string;
        actionToken: string;
      };

      await this.authRepository.save({
        ...user.detail,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
        user_id: user.detail.id,
      });
      this.logger.warn('New user regisrtated!');
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

      const newTokens = new GetTokens(this.jwtService, this.configService);
      const tokens = (await newTokens.getTokens(id, email)) as {
        accessToken: string;
        refreshToken: string;
        actionToken: string;
      };

      await this.authRepository.update(id, {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
      });

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
  async logout(authHeader: string): Promise<IResponse<boolean>> {
    try {
      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id } = decodedToken as { id: number };

      await this.authRepository.update(id, {
        refresh_token: null,
        action_token: null,
        access_token: null,
      });
      return {
        status_code: HttpStatus.OK,
        detail: true,
        result: `User logged out.`,
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

  // update refresh, access and action tokens
  async refreshTokens(authHeader: string): Promise<IResponse<object>> {
    try {
      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id, email } = decodedToken as { id: number; email: string };

      const newTokens = new GetTokens(this.jwtService, this.configService);

      const tokens = (await newTokens.getTokens(id, email)) as {
        accessToken: string;
        refreshToken: string;
        actionToken: string;
      };

      await this.authRepository.update(id, {
        refresh_token: tokens.refreshToken,
        action_token: tokens.actionToken,
        access_token: tokens.accessToken,
      });
      return {
        status_code: HttpStatus.OK,
        detail: tokens,
        result: `User logged out.`,
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

  async getProfile(authHeader: string): Promise<IResponse<User>> {
    try {
      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id } = decodedToken as { id: number };
      const user = await this.userService.getUserById(id);

      if (!user) throw new ForbiddenException('Access Denied');

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
}
