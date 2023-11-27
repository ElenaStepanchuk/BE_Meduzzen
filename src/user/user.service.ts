import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { genSalt, hash } from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.logger = new Logger('CHANGING IN DATABASE');
  }

  logger: Logger;

  // Registor new user
  public async createUser(userData: User): Promise<User> {
    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(userData.password, salt);
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      this.logger.warn('New user added in database');
      return await this.userRepository.save(newUser);
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
  public async getAllUsers(): Promise<User[]> {
    try {
      const usersList = await this.userRepository.find({
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'createdAt',
          'updatedAt',
        ],
      });

      return usersList;
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
  public async getUserData(id: number): Promise<User | null> {
    try {
      const userData = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'first_name',
          'last_name',
          'email',
          'createdAt',
          'updatedAt',
        ],
      });

      return userData;
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
  public async updateUserData(id: number, body: User) {
    try {
      const { first_name, last_name, email, createdAt, updatedAt } = body;
      const updateUserData = await this.userRepository.update(
        { id },
        { first_name, last_name, email, createdAt, updatedAt },
      );
      this.logger.warn(`User width id${id} updated in database`);
      return updateUserData;
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
  public async deleteUser(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
      this.logger.warn(`User width id${id} deleted in database`);
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
}
