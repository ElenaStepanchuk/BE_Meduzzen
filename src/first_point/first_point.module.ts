import { Module } from '@nestjs/common';
import { FirstPointController } from './first_point.controller';
import { FirstPointService } from './first_point.service';

@Module({
  controllers: [FirstPointController],
  providers: [FirstPointService]
})
export class FirstPointModule {}
