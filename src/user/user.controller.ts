import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  // UseGuards,
  Query,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

import { IResponse } from 'src/types/Iresponse';
import { User } from './entities/user.entity';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Controller('users')
export class UserController {
  logger: Logger;
  constructor(
    private readonly userService: UserService, // private readonly paginationController: PaginationController,
    private readonly paginationService: PaginationService,
  ) {
    this.logger = new Logger('USER CONTROLLER LOGGER');
  }

  // Pagination;
  @Get('pagination')
  findAllWidthPagination(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ): Promise<IResponse<User[]>> {
    return this.paginationService.findAllWidthPagination(+page, +limit);
  }

  // Registor new user
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    return await this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUser(): Promise<IResponse<User[]>> {
    return await this.userService.getAllUsers();
  }

  // Get user by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: number): Promise<IResponse<User>> {
    return await this.userService.getUserData(id);
  }

  // Update user data
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse<User>> {
    return await this.userService.updateUserData(id, updateUserDto);
  }

  // Delete user by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<number>> {
    return await this.userService.deleteUser(id);
  }
}
