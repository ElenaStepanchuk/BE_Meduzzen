import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class Pagination {
  constructor() {}
  async getPage(page: number, limit: number): Promise<object> {
    {
      try {
        const list = { take: limit, skip: (page - 1) * limit };
        return list;
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
}
