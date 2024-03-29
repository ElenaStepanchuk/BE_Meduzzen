import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { Company } from './entities/company.entity';
import { IResponse } from 'src/types/Iresponse';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import { Member } from './entities/member.entity';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Registor new company
  @Post()
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<Company>> {
    return this.companyService.createCompany(createCompanyDto, authHeader);
  }

  // Get all companies
  @Get()
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<IResponse<Company[]>> {
    return this.companyService.findAllCompanies(page, limit);
  }

  // Get company by id
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IResponse<Company>> {
    return this.companyService.findOneCompanyById(id);
  }

  // Update company data
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Patch(':id')
  async update(
    @Headers('Authorization') authHeader: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<IResponse<Company>> {
    return this.companyService.updateCompanyById(
      authHeader,
      id,
      updateCompanyDto,
    );
  }

  // Delete company by id
  @UseGuards(AuthGuard(['auth0', 'jwt']), RolesGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<Company>> {
    return this.companyService.deleteCompanyById(authHeader, id);
  }

  // all companies list by user id
  @UseGuards(AuthGuard(['auth0', 'jwt']))
  @Get('user/list')
  findCompaniesByUserId(
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<Member[]>> {
    return this.companyService.findCompaniesByUserId(authHeader);
  }
}
