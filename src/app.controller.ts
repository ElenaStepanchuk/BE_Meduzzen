import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { IResponse } from './types/Iresponse';

@Controller()
export class AppController {
  logger: Logger;
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHello(): Promise<IResponse<string>> {
    this.logger = new Logger('AppController LOGGER');
    this.logger.log('AppController is working');
    return this.appService.getHello();
  }
}
