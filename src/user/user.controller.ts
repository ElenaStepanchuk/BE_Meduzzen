import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { PaginationService } from 'src/utils/pagination/util.pagination';

import { IResponse } from 'src/types/Iresponse';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
  ) {
    this.logger = new Logger('USER CONTROLLER LOGGER');
  }

  // Registor new user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    const newUser = await this.userService.createUser(createUserDto);
    return {
      status_code: HttpStatus.CREATED,
      detail: newUser,
      result: 'We created new user',
    };
  }

  // Get all users
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.paginationService.paginate({
      page,
      limit,
      route: 'http://localhost:4000/users',
    });
  }

  // Get user by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: number): Promise<IResponse> {
    const userData = await this.userService.getUserData(id);
    if (userData) {
      return {
        status_code: HttpStatus.OK,
        detail: userData,
        result: `User width id:${id} found.`,
      };
    }
    throw new HttpException(
      `User width id:${id} not found.`,
      HttpStatus.NOT_FOUND,
    );
  }

  // Update user data
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse> {
    const userData = await this.userService.getUserData(id);
    if (userData) {
      await this.userService.updateUserData(id, updateUserDto);
      return {
        status_code: HttpStatus.OK,
        detail: updateUserDto,
        result: `User width id:${id} updated.`,
      };
    }
    throw new HttpException(
      `User width id:${id} not found.`,
      HttpStatus.NOT_FOUND,
    );
  }

  // Delete user by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const userData = await this.userService.getUserData(id);
    if (userData) {
      await this.userService.deleteUser(id);
      return {
        status_code: HttpStatus.OK,
        detail: id,
        result: `User width id:${id} deleted.`,
      };
    }
    throw new HttpException(
      `User width id:${id} not found.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
