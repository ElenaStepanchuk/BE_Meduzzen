import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
//
//
//
// @Module({
//   controllers: [AppController],
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '../.env',
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (ConfigService: ConfigService) => ({
//         type: config.get<'aurora-data-api'>('TYPEORM_CONNECTION'),
//         username: config.get<'string'>('TYPEORM_USERNAME'),
//         password: config.get<'string'>('TYPEORM_PASSWORD'),
//         database: config.get<'string'>('TYPEORM_DATABASE'),
//         port: config.get<'number'>('TYPEORM_PORT'),
//         entities: [__dirname + '/dist/**/*.entity{.ts, .js}'],
//         synchronize: true,
//         autoLoadEntities: true,
//         logging: true,
//       }),
//     }),
//   ],
//   providers: [AppService],
// })
// export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get<string>('DB_USERNAME'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts, .js}'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
