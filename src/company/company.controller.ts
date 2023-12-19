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
  // UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { Company } from './entities/company.entity';
import { IResponse } from 'src/types/Iresponse';
// import { RolesGuard } from './guards/roles.guard';
// import { Roles } from './decorators/roles.decorator';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Registor new company
  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(['owner'])
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<IResponse<Company>> {
    return this.companyService.createCompany(createCompanyDto);
  }

  // Get all companies
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<IResponse<Company[]>> {
    return this.companyService.findAllCompanies(page, limit);
  }

  // Get company by id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IResponse<Company>> {
    return this.companyService.findOneCompanyById(id);
  }

  // Update company data
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<IResponse<Company>> {
    return this.companyService.updateCompanyById(id, updateCompanyDto);
  }

  // Delete company by id
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<Company>> {
    return this.companyService.deleteCompanyById(id);
  }
}
