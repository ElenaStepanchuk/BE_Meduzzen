import { DataSource } from 'typeorm';

const HOST = process.env.DB_HOST;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: HOST,
  port: 5432,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: [__dirname + '/**/*.entity{.ts, .js}'],
  migrations: [__dirname + '/migrations/*.ts'],
});

export default AppDataSource;
