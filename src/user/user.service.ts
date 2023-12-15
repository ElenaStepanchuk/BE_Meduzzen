import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from './entities/user.entity';
import { IResponse } from 'src/types/Iresponse';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Hash } from 'src/utils/hash.util';
import { DecodedToken } from 'src/utils/decodedToken.util';
import { Pagination } from 'src/utils/pagination.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.logger = new Logger('CHANGING IN DATABASE');
  }

  logger: Logger;

  // Registor new user
  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IResponse<User> | null> {
    try {
      const existUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
      if (existUser) throw new BadRequestException('This email already exist');

      const hash = new Hash();
      const hashedPassword = await hash.hashData(createUserDto.password);

      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      this.logger.warn('New user added in database');
      return {
        status_code: HttpStatus.CREATED,
        detail: newUser,
        result: 'We created new user',
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'User not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Get all users
  public async getAllUsers(
    page: number,
    limit: number,
  ): Promise<IResponse<User[]> | null> {
    try {
      const pagination = new Pagination();
      const paginatePage = await pagination.getPage(page, limit);

      const usersList = await this.userRepository.find({
        select: ['id', 'email', 'createdAt', 'updatedAt'],
        ...paginatePage,
      });

      return {
        status_code: HttpStatus.OK,
        detail: usersList,
        result: `We get all users list`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Users not found',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Get user by id
  public async getUserById(id: number): Promise<IResponse<User> | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'createdAt', 'updatedAt'],
      });

      return {
        status_code: HttpStatus.OK,
        detail: user,
        result: `User width id ${id} found.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width id ${id} not found.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Update user data
  public async updateUserData(
    user_id: number,
    authHeader: string,
    body: UpdateUserDto,
  ): Promise<IResponse<User> | null> {
    try {
      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id } = decodedToken as { id: number };
      if (id !== user_id)
        throw new ForbiddenException('You can update only your profile!');

      const { email, first_name, last_name, photo } = body;
      if (email)
        throw new ForbiddenException('You can`t update or change your email!');
      await this.userRepository.update(
        { id },
        { first_name, last_name, photo },
      );

      this.logger.warn(`User width id ${id} updated in database`);
      return {
        status_code: HttpStatus.OK,
        detail: body,
        result: `User width id:${id} updated.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width id ${user_id} not found.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Delete user by id
  public async deleteUser(
    user_id: number,
    authHeader: string,
  ): Promise<IResponse<number> | null> {
    try {
      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id } = decodedToken as { id: number };
      if (id !== user_id)
        throw new ForbiddenException('You can delete only your profile!');

      await this.userRepository.delete(id);
      this.logger.warn(`User width id${id} deleted in database`);
      return {
        status_code: HttpStatus.OK,
        detail: id,
        result: `User width id:${id} deleted.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width id:${user_id} not found.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Find user by email
  async findOneByEmail(email: string): Promise<IResponse<User> | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) throw new NotFoundException('User did not find');
      return {
        status_code: HttpStatus.OK,
        detail: user,
        result: `User width  ${email} found.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width this id or email didn't find.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
