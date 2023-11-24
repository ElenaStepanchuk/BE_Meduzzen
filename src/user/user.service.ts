import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUser } from 'src/types/Iuser';

import { genSalt, hash } from 'bcrypt';

import { User } from './entities/user.entity';
import { NotFoundUserException } from './exceptions/notFoundUserException.exception';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor() {
    this.logger = new Logger('CHANGING IN DATABASE');
  }
  logger: Logger;
  @InjectRepository(User) private readonly userRepository: Repository<User>;

  // Registor new user
  public async createUser(userData: IUser): Promise<User> {
    const salt = await genSalt(10);
    const hashedPassword = await hash(userData.password, salt);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    this.logger.warn('New user added in database');
    return await this.userRepository.save(newUser);
  }

  // Get all users
  public async getAllUsers(): Promise<User[]> {
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
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  // Get user by id
  public async getUserData(id: number): Promise<User | null> {
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
    if (!userData) {
      throw new NotFoundUserException();
    }
    return userData;
  }

  // Update user data
  public async updateUserData(id: number, body: IUser) {
    const { first_name, last_name, email, createdAt, updatedAt } = body;
    const updateUserData = await this.userRepository.update(
      { id },
      { first_name, last_name, email, createdAt, updatedAt },
    );
    this.logger.warn(`User width id${id} updated in database`);
    return updateUserData;
  }

  // Delete user by id
  public async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
    this.logger.warn(`User width id${id} deleted in database`);
  }
}
