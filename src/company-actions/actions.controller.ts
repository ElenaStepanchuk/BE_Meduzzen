import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Delete,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { IResponse } from 'src/types/Iresponse';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/company/guards/roles.guard';
import { CompareUseGuard } from './guards/compareUser.guard';
import { CreateInviteDto } from './dto/createInvite.dto';
import { CreateMemberDto } from 'src/company/dto/createMember.dto';

@Controller('actions/owner')
export class ActionsCompanyController {
  constructor(private readonly actionsService: ActionsService) {}

  // Make invite from owner to user
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Post('invite/:company_id')
  async invitedUser(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateInviteDto>> {
    return this.actionsService.invited(company_id, user_id);
  }

  // Reject by owner invite from owner to user
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Post('delete/:company_id')
  async deleteInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateInviteDto[]>> {
    return this.actionsService.deleteInvite(company_id, user_id);
  }

  // Owner accept invite from user
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Post('accept/:company_id')
  async AcceptInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateMemberDto>> {
    return this.actionsService.AcceptInvite(company_id, user_id);
  }

  // Delete user from owner by owner
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Delete('delete/user/:company_id')
  async deleteInvitedByOwner(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    return this.actionsService.deleteInvitedOwner(company_id, user_id);
  }

  // Owner`s list invites user
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Get('invites/:company_id')
  async ownerInvitesList(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('status') status: string,
  ): Promise<IResponse<CreateInviteDto[]>> {
    return this.actionsService.ownerInvitesList(company_id, status);
  }

  // Owner`s list where are users(members)
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Get(':company_id/users')
  async ownerUserList(
    @Param('company_id', ParseIntPipe) company_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    return this.actionsService.ownerUserList(company_id);
  }

  // Add role admin
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Post('role/:company_id')
  addRoleAdmin(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
    @Body('role') role: string,
  ): Promise<IResponse<object>> {
    return this.actionsService.addRoleAdmin(company_id, user_id, role);
  }

  // Admin list
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Get('admin/:company_id')
  adminList(
    @Param('company_id', ParseIntPipe) company_id: number,
  ): Promise<IResponse<any>> {
    return this.actionsService.adminList(company_id);
  }
}

@Controller('actions/user')
export class ActionsUserController {
  constructor(private readonly actionsService: ActionsService) {}

  // Make invite from user to owner
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Post('invite/:company_id')
  async invitedCompany(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateInviteDto>> {
    return this.actionsService.invited(company_id, user_id);
  }

  // Reject by user an invite that send to company
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Post('delete/:company_id')
  async deleteUserInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateInviteDto[]>> {
    return this.actionsService.deleteInvite(company_id, user_id);
  }

  // User accept invite
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Post('accept/:company_id')
  async AcceptCompanyInvite(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateMemberDto>> {
    return this.actionsService.AcceptInvite(company_id, user_id);
  }

  // Delete invite from user to company
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Delete('delete/:company_id')
  async deleteInvitebyUser(
    @Param('company_id', ParseIntPipe) company_id: number,
    @Query('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    return this.actionsService.deleteInvitedOwner(company_id, user_id);
  }

  //List invites to companies
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Get('invites/:user_id')
  async userInvitesList(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Query('status') status: string,
  ): Promise<IResponse<CreateInviteDto[]>> {
    return this.actionsService.userInvitesList(user_id, status);
  }

  // List companyes where are this user(member)
  @UseGuards(AuthGuard(['auth0', 'jwt']), CompareUseGuard)
  @Get(':user_id/companies')
  async userCompaniesList(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    return this.actionsService.userCompaniesList(user_id);
  }
}
