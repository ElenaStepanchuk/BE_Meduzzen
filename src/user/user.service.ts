import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { IResponse } from 'src/types/Iresponse';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Hash } from 'src/utils/hash.util';

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
  public async getUserById(id: number): Promise<IResponse<User> | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      this.logger.warn('id', user);
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
    id: number,
    body: UpdateUserDto,
  ): Promise<IResponse<User> | null> {
    try {
      const { email } = body;
      await this.userRepository.update({ id }, { email });
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
          error: `User width id ${id} not found.`,
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
