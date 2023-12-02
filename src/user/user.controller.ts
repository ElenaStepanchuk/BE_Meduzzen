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
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

import { IResponse } from 'src/types/Iresponse';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger('USER CONTROLLER LOGGER');
  }

  // Registor new user
  @Post()
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
  @Put(':id')
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
