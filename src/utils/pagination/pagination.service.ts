import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/types/Iresponse';

@Injectable()
export class PaginationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAllWidthPagination(
    page: number,
    limit: number,
  ): Promise<IResponse<User[]> | null> {
    try {
      const allList = await this.userRepository.find({
        select: ['id', 'email', 'createdAt', 'updatedAt'],
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        status_code: HttpStatus.OK,
        detail: allList,
        result: `We get all users on page ${page}`,
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
}
