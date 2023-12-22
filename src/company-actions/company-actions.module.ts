import { Module } from '@nestjs/common';
import { CompanyActionsService } from './company-actions.service';
import { CompanyActionsController } from './company-actions.controller';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { CompanyModule } from 'src/company/company.module';
import { UserModule } from 'src/user/user.module';
import { Invite } from './entities/invite.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CompanyModule, UserModule, TypeOrmModule.forFeature([Invite])],
  controllers: [CompanyActionsController],
  providers: [CompanyActionsService, CompanyService, UserService],
})
export class CompanyActionsModule {}
