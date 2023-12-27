import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/company/entities/member.entity';
import { IResponse } from 'src/types/Iresponse';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { InviteStatus } from './enam/inviteStatus';
import { CreateInviteDto } from './dto/createInvite.dto';
import { CreateMemberDto } from 'src/company/dto/createMember.dto';

@Injectable()
export class ActionsService {
  constructor(
    private userService: UserService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Invite) private inviteRepository: Repository<Invite>,
  ) {
    this.logger = new Logger('COMPANY ACTIONS');
  }

  logger: Logger;

  // Make invite from company to user/Make invite from user to company
  async invited(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<CreateInviteDto>> {
    try {
      const checkInviting = await this.memberRepository.find({
        where: { company_id, user_id },
      });

      if (user_id === checkInviting[0]?.user_id)
        throw new BadRequestException('You can`t invite yourself');

      const user = await this.userService.getUserById(user_id);
      if (!user) throw new NotFoundException('User not found');

      const invite = await this.inviteRepository.find({
        where: { company_id, user_id },
      });

      if (invite.length === 0) {
        const newInvite = await this.inviteRepository.save({
          company_id: company_id,
          user_id: user_id,
          message: 'Accept my invitation!',
          status: InviteStatus.PENDING,
        });

        return {
          status_code: HttpStatus.OK,
          detail: newInvite,
          result: 'We invited new object in this company/',
        };
      }
      throw new BadRequestException('You already invited this object.');
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Reject by owner invite from owner to user/Rreject by user invite user to company
  async deleteInvite(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<CreateInviteDto[]>> {
    try {
      const invite = await this.inviteRepository.find({
        where: { user_id, company_id, status: InviteStatus.PENDING },
      });

      if (!invite)
        throw new NotFoundException(
          'Not found invite or status invite rejected/accepted.',
        );

      await this.inviteRepository.update(
        { id: invite[0].id },
        { status: InviteStatus.REJECTED },
      );

      return {
        status_code: HttpStatus.OK,
        detail: invite,
        result: `Invite to user_id ${user_id} deleted!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Owner accept invite/ User accept invite
  async AcceptInvite(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<CreateMemberDto>> {
    try {
      const invite = await this.inviteRepository.find({
        where: { company_id, user_id, status: InviteStatus.PENDING },
      });
      if (!invite)
        throw new NotFoundException(
          'Not found invite or status invite rejected/accepted.',
        );

      const user = await this.userService.getUserById(user_id);
      if (!user) throw new NotFoundException('User not found');

      const acceptInvite = await this.memberRepository.save({
        role: 'user',
        user_id,
        user: user.detail.email,
        company_id,
      });
      await this.inviteRepository.update(
        { id: invite[0].id },
        { status: InviteStatus.ACCEPTED },
      );

      return {
        status_code: HttpStatus.OK,
        detail: acceptInvite,
        result: `Invite with user_id ${user_id} accept!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Delete user from owner to user/Delete invite from user to company
  async deleteInvitedOwner(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    try {
      const member = await this.memberRepository.find({
        where: { company_id, user_id },
      });

      if (!member) throw new NotFoundException('Not found this company!');

      const invite = await this.inviteRepository.find({
        where: { company_id, user_id },
      });

      if (invite.length === 0)
        throw new NotFoundException('Not found this invite.');

      await this.inviteRepository.delete(invite[0].id);

      await this.memberRepository.delete(member[0].id);

      return {
        status_code: HttpStatus.OK,
        detail: { ...member },
        result: `Invite with user_id ${user_id} deleted!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Owner list invites user
  async ownerInvitesList(
    company_id: number,
    status: string,
  ): Promise<IResponse<CreateInviteDto[]>> {
    try {
      status;
      const invite = await this.inviteRepository.find({
        where: { company_id, status: status },
      });
      if (!invite)
        throw new NotFoundException(
          'Not found invite or status invite rejected/accepted.',
        );

      return {
        status_code: HttpStatus.OK,
        detail: invite,
        result: `Invites list company_id ${company_id} created!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  //  Owner`s list where are users(members)
  async ownerUserList(
    company_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    try {
      const companiesList = await this.memberRepository.find({
        where: { company_id },
      });
      if (!companiesList) throw new NotFoundException('Not found companies');

      return {
        status_code: HttpStatus.OK,
        detail: companiesList,
        result: `Users list company_id ${company_id} created!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  //List invites to companies
  async userInvitesList(
    user_id: number,
    status: string,
  ): Promise<IResponse<CreateInviteDto[]>> {
    try {
      status;
      const invite = await this.inviteRepository.find({
        where: { user_id, status: status },
      });
      if (!invite)
        throw new NotFoundException(
          'Not found invite or status invite rejected/accepted.',
        );

      return {
        status_code: HttpStatus.OK,
        detail: invite,
        result: `Invites list user_id ${user_id} created!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // List companyes where are this user(member)
  async userCompaniesList(
    user_id: number,
  ): Promise<IResponse<CreateMemberDto[]>> {
    try {
      const companiesList = await this.memberRepository.find({
        where: { user_id, role: 'user' },
      });
      if (!companiesList) throw new NotFoundException('Not found companies');

      return {
        status_code: HttpStatus.OK,
        detail: companiesList,
        result: `Invites list user_id ${user_id} created!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Add role admin
  async addRoleAdmin(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<object>> {
    try {
      const user = await this.memberRepository.find({
        where: {
          company_id,
          user_id,
          role: 'user',
        },
      });
      if (user.length === 0)
        throw new NotFoundException('Didn`t find user with this id!');
      const admin = await this.memberRepository.update(user_id, {
        role: 'administrator',
      });

      // this.logger.warn('admin', { ...admin });

      return {
        status_code: HttpStatus.OK,
        detail: admin,
        result: 'We added role `administrator` this user!',
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  // Admin list
  async adminList(company_id: number): Promise<IResponse<any>> {
    try {
      const list = await this.memberRepository.find({
        where: { company_id, role: 'administrator' },
      });
      if (!list) throw new NotFoundException('Not found administrators!');

      return {
        status_code: HttpStatus.OK,
        detail: list,
        result: `Administrators list created!`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Company not created',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
