import { Logger, HttpStatus, HttpException } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
export class Hash {
  constructor() {
    this.logger = new Logger('HASH');
  }
  logger: Logger;
  async hashData(data: string) {
    try {
      const salt = await genSalt(10);
      return hash(data, salt);
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
