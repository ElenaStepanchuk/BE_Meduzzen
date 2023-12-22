import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { CompanyActionsService } from './company-actions.service';
import { IResponse } from 'src/types/Iresponse';

@Controller('companies/actions')
export class CompanyActionsController {
  constructor(private readonly companyActionsService: CompanyActionsService) {}

  // Make invite by company to user
  @Post('inviting/:company_id')
  async invitedUser(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<object>> {
    return this.companyActionsService.invitedUser(company_id, user_id);
  }

  // Delete invite by company to user
  @Delete('inviting/:company_id')
  async DeleteInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<object>> {
    return this.companyActionsService.DeleteInvite(company_id, user_id);
  }

  // User accept invite
  @Post('invite/accept/:user_id')
  async userAcceptInvite(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('company_id', ParseIntPipe) company_id: number,
  ): Promise<IResponse<any>> {
    return this.companyActionsService.userAcceptInvite(user_id, company_id);
  }

  // User delete invite
  @Delete('invite/delete/:user_id')
  async userDeleteInvite(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('company_id', ParseIntPipe) company_id: number,
  ): Promise<IResponse<any>> {
    return this.companyActionsService.userAcceptInvite(user_id, company_id);
  }

  // Make invite by user to company
  @Post('inviting/:company_id')
  async invitedCompany(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<object>> {
    return this.companyActionsService.invitedCompany(company_id, user_id);
  }

  // Delete invite by user to company
  @Delete('inviting/:company_id')
  async DeleteUserInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<object>> {
    return this.companyActionsService.DeleteUserInvite(company_id, user_id);
  }
}
