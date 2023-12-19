import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponse } from 'src/types/Iresponse';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Pagination } from 'src/utils/pagination.util';
import { Member } from './entities/member.entity';
import { DecodedToken } from 'src/utils/decodedToken.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanyService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    this.logger = new Logger('COMPANY SERVICE');
  }

  logger: Logger;

  // Register new company
  async createCompany(
    createCompanyDto: CreateCompanyDto,
    authHeader: string,
  ): Promise<IResponse<Company> | null> {
    try {
      const existCompany = await this.companyRepository.findOne({
        where: { company_name: createCompanyDto.company_name },
      });
      if (existCompany)
        throw new BadRequestException('This company already exist');

      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { id } = decodedToken as { id: number };
      const user = await this.userService.getUserById(id);

      const newCompany = await this.companyRepository.save({
        ...createCompanyDto,
      });

      this.logger.warn('newCompany', newCompany);
      await this.memberRepository.save({
        role: 'owner',
        user_id: user.detail.id,
        user: user.detail.email,
        company_name: newCompany.company_name,
        company: newCompany,
      });
      this.logger.warn('New company added in database');
      return {
        status_code: HttpStatus.CREATED,
        detail: newCompany,
        result: 'We created new company',
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

  async findAllCompanies(
    page: number,
    limit: number,
  ): Promise<IResponse<Company[]> | null> {
    try {
      const pagination = new Pagination();
      const paginatePage = await pagination.getPage(page, limit);
      const companiesList = await this.companyRepository.find({
        ...paginatePage,
      });
      return {
        status_code: HttpStatus.OK,
        detail: companiesList,
        result: `We get all companies list`,
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

  // Get company by id
  async findOneCompanyById(id: number): Promise<IResponse<Company>> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
      });
      if (!company) throw new BadRequestException('This company no found!');
      return {
        status_code: HttpStatus.OK,
        detail: company,
        result: `Company with id ${id} found.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.NOT_FOUND,
          error: `Company with id ${id} not found.`,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async updateCompanyById(
    authHeader: string,
    id: number,
    body: UpdateCompanyDto,
  ): Promise<IResponse<Company> | null> {
    try {
      const existCompany = await this.companyRepository.findOne({
        where: { id: id },
      });

      if (!existCompany)
        throw new BadRequestException('This company not found!');

      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { email } = decodedToken as { email: string };

      const company = await this.memberRepository.findOne({
        where: { user: email },
      });

      if (!company && company.role !== 'owner')
        throw new BadRequestException(' You can update only your own company!');
      const { company_name, company_description, visibility } = body;

      await this.companyRepository.update(
        { id },
        { company_name, company_description, visibility },
      );

      this.logger.warn(`Company with id ${id} updated in database`);

      return {
        status_code: HttpStatus.OK,
        detail: body,
        result: `Company with id ${id} updated.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.NOT_FOUND,
          error: `Company with id ${id} not found.`,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  // delete company
  async deleteCompanyById(
    authHeader: string,
    id: number,
  ): Promise<IResponse<Company>> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
      });
      if (!company) throw new BadRequestException('This company no found!');

      const getOnlyToken = new DecodedToken(this.configService);
      const decodedToken = await getOnlyToken.decoded(authHeader);
      const { email } = decodedToken as { email: string };

      const deleteCompany = await this.memberRepository.findOne({
        where: { user: email },
      });

      if (!deleteCompany && deleteCompany.role !== 'owner')
        throw new BadRequestException(' You can delete only your own company!');

      await this.memberRepository.delete(deleteCompany.id);
      await this.companyRepository.delete(id);
      this.logger.warn(`Company with id${id} deleted in database`);
      return {
        status_code: HttpStatus.OK,
        detail: company,
        result: `Company with id ${id} deleted in database.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.NOT_FOUND,
          error: `Company with id ${id} not found.`,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
