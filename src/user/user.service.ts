import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { genSalt, hash } from 'bcrypt';

import { User } from './entities/user.entity';
import { IResponse } from 'src/types/Iresponse';

import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

      const salt = await genSalt(10);
      const hashedPassword = await hash(createUserDto.password, salt);

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
  public async getAllUsers(): Promise<IResponse<User[]> | null> {
    try {
      const usersList = await this.userRepository.find({
        select: ['id', 'email', 'createdAt', 'updatedAt'],
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
  public async getUserData(id: number): Promise<IResponse<User> | null> {
    try {
      const userData = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'createdAt', 'updatedAt'],
      });

      return {
        status_code: HttpStatus.OK,
        detail: userData,
        result: `User width id:${id} found.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width id:${id} not found.`,
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
    id: number,
    body: User,
  ): Promise<IResponse<User> | null> {
    try {
      const { email, createdAt, updatedAt } = body;
      await this.userRepository.update({ id }, { email, createdAt, updatedAt });
      this.logger.warn(`User width id${id} updated in database`);
      return {
        status_code: HttpStatus.OK,
        detail: body,
        result: `User width id:${id} updated.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `User width id:${id} not found.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Delete user by id
  public async deleteUser(id: number): Promise<IResponse<number> | null> {
    try {
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
          error: `User width id:${id} not found.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Find user by email
  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: `Email or password not valid.`,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
