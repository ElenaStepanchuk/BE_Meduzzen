import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { IResponse } from './types/Iresponse';

@Injectable()
export class AppService {
  logger: Logger;
  constructor() {
    this.logger = new Logger('AppService LOGGER');
  }

  async getHello(): Promise<IResponse<string>> {
    this.logger.log('It`s working');
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
