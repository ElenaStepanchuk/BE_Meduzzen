import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
const PORT = process.env.PORT || 5000;

const logger = new Logger('MAIN LOGGER, PORT:');
logger.log(PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
