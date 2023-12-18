import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
