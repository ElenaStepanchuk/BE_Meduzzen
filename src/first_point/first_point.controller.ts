import { Controller, Get } from '@nestjs/common';

@Controller('first-point')
export class FirstPointController {
  @Get()
  endpoint(): { status_code: number; detail: string; result: string } {
    return {
      status_code: 200,
      detail: 'ok',
      result: 'working',
    };
  }
}
