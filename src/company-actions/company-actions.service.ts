import {
  BadRequestException,
  // BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/entities/company.entity';
import { Member } from 'src/company/entities/member.entity';
import { IResponse } from 'src/types/Iresponse';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { User } from '@auth0/auth0-spa-js';
import { InviteStatus } from './enam/inviteStatus';

@Injectable()
export class CompanyActionsService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private companyService: CompanyService,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Invite) private inviteRepository: Repository<Invite>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.logger = new Logger('COMPANY ACTIONS');
  }

  logger: Logger;

  // Make invite by company to user
  async invitedUser(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<object>> {
    try {
      const invitUser = await this.inviteRepository.find({
        where: { company_id },
      });

      const usersIdInCompany = invitUser.map((item) => item.user_id);

      const checkUsersId = await usersIdInCompany.includes(user_id);

      if (!invitUser || checkUsersId)
        throw new BadRequestException('You already invite this user.');

      const invite = await this.inviteRepository.save({
        company_id: company_id,
        user_id: user_id,
        message: 'Welcome to my company!',
        status: InviteStatus.PENDING,
      });

      return {
        status_code: HttpStatus.OK,
        detail: invite,
        result: 'We invited new user in our company/',
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

  // Delete invite by company to user
  async DeleteInvite(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<object>> {
    try {
      const invitedUser = await this.inviteRepository.find({
        where: { user_id },
      });

      const findCompany = await invitedUser.find(
        (item) => item.company_id === company_id,
      );

      if (!findCompany) throw new BadRequestException('User not found!');

      await this.inviteRepository.delete(company_id);

      return {
        status_code: HttpStatus.OK,
        detail: { ...findCompany },
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

  // User accept invite
  async userAcceptInvite(user_id: number, company_id: number): Promise<any> {
    try {
      const myInvites = await this.inviteRepository.find({
        where: { user_id },
      });

      const findCompanyInvite = await myInvites.find(
        (item) => item.company_id === company_id,
      );

      const user = await this.userService.getUserById(user_id);

      const acceptInvite = await this.memberRepository.save({
        role: 'user',
        user_id,
        user: user.detail.email,
        company_id,
      });
      await this.inviteRepository.delete(findCompanyInvite.id);
      this.logger.warn('acceptInvite', {
        ...acceptInvite,
      });

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

  // User delete invite
  async userDeleteInvite(user_id: number, company_id: number): Promise<any> {
    try {
      const myInvites = await this.inviteRepository.find({
        where: { user_id },
      });

      const findCompanyInvite = await myInvites.find(
        (item) => item.company_id === company_id,
      );

      await this.inviteRepository.delete(findCompanyInvite.id);

      return {
        status_code: HttpStatus.OK,
        detail: myInvites,
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

  // Make invite by user to company
  async invitedCompany(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<object>> {
    try {
      const invitUser = await this.inviteRepository.find({
        where: { company_id },
      });

      const usersIdInCompany = invitUser.map((item) => item.user_id);

      const checkUsersId = await usersIdInCompany.includes(user_id);

      if (!invitUser || checkUsersId)
        throw new BadRequestException('You already invite this company.');

      const invite = await this.inviteRepository.save({
        company_id: company_id,
        user_id: user_id,
        message: 'I want to join in your company!',
        status: InviteStatus.PENDING,
      });

      return {
        status_code: HttpStatus.OK,
        detail: invite,
        result: 'We send invite in a new company.',
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

  // Delete invite by user to company
  async DeleteUserInvite(
    company_id: number,
    user_id: number,
  ): Promise<IResponse<object>> {
    try {
      const invitedUser = await this.inviteRepository.find({
        where: { user_id },
      });

      const findCompany = await invitedUser.find(
        (item) => item.company_id === company_id,
      );

      if (!findCompany) throw new BadRequestException('User not found!');

      await this.inviteRepository.delete(company_id);

      return {
        status_code: HttpStatus.OK,
        detail: { ...findCompany },
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
}
