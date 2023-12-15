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
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

import { IResponse } from 'src/types/Iresponse';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Auth0Guard } from 'src/auth/guards/auth0.guard';

@Controller('users')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger('USER CONTROLLER LOGGER');
  }

  // Registor new user
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @HttpCode(HttpStatus.OK)
  async getAllUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<IResponse<User[]>> {
    return this.userService.getAllUsers(page, limit);
  }

  // Get user by email
  @Get(':email')
  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @HttpCode(HttpStatus.OK)
  async getUserByEmailOrId(
    @Param('email') email: string,
  ): Promise<IResponse<User>> {
    return this.userService.findOneByEmail(email);
  }

  // Get user by id
  @Get(':id')
  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    return this.userService.getUserById(id);
  }

  // Update user data
  @Patch(':id')
  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Headers('Authorization') authHeader: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse<User>> {
    return this.userService.updateUserData(id, authHeader, updateUserDto);
  }

  // Delete user by id
  @Delete(':id')
  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<number>> {
    return this.userService.deleteUser(id, authHeader);
  }
}
