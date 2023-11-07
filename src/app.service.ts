import { Injectable } from '@nestjs/common';
import { IResponse } from './types/Iresponse';

@Injectable()
export class AppService {
  async getHello(): Promise<IResponse> {
    return {
      status_code: 200,
      detail: 'ok',
      result: 'working',
    };
  }
}
