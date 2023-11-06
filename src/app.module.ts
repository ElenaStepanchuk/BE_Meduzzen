import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstPointModule } from './first_point/first_point.module';
import { FirstPointController } from './first_point/first_point.controller';

@Module({
  imports: [FirstPointModule],
  controllers: [AppController, FirstPointController],
  providers: [AppService],
})
export class AppModule {}
