import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { IResponse } from './types/Iresponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHello(): Promise<IResponse> {
    return this.appService.getHello();
  }
}
