import { Injectable, HttpStatus } from '@nestjs/common';
import { IResponse } from './types/Iresponse';

@Injectable()
export class AppService {
  async getHello(): Promise<IResponse> {
    return {
      status_code: HttpStatus.OK,
      detail: 'ok',
      result: 'working',
    };
  }
}
