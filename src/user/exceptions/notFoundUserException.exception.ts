import { HttpException, HttpStatus } from '@nestjs/common';

interface IError {
  message?: never;
  error?: never;
  createdAt?: never;
  [k: string]: string;
}

export class NotFoundUserException extends HttpException {
  constructor(error: IError = null) {
    super(
      {
        message: `User width this id not found`,
        error: HttpStatus.NOT_FOUND,
        createdAt: new Date(),
        ...error,
      },

      HttpStatus.NOT_FOUND,
    );
  }
}
