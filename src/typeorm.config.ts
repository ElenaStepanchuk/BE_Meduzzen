import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'fygbkjujd365',
  database: 'bemeduzzen',
  entities: [__dirname + '/**/*.entity{.ts, .js}'],
  migrations: [__dirname + '/migrations/*.ts'],
});

export default AppDataSource;
