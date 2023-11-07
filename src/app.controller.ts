import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { IResponse } from './types/Iresponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  async getHello(): Promise<IResponse> {
    return this.appService.getHello();
  }
}
