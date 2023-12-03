import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { UserService } from 'src/user/user.service';

import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PaginationService, UserService],
  exports: [TypeOrmModule, UserService, PaginationService],
})
export class PaginationModule {}
