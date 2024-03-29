import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });

const configService = new ConfigService();

const HOST = configService.get('DB_HOST');
const PORT = configService.get('DB_PORT');
const USERNAME = configService.get('DB_USERNAME');
const PASSWORD = configService.get('DB_PASSWORD');
const DATABASE = configService.get('DB_NAME');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: Number(PORT),
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: [__dirname + '/**/*.entity{.ts, .js}'],
  migrations: [__dirname + '/migrations/*.ts'],
});

export default AppDataSource;
