import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionFilter } from './exceptionsFilters/exception.filter';

const PORT = process.env.PORT || 5000;

const logger = new Logger('MAIN LOGGER, PORT:');
logger.log(PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
