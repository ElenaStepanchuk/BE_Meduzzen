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
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

import { IResponse } from 'src/types/Iresponse';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

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
  @UseGuards(AccessTokenGuard)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUser(): Promise<IResponse<User[]>> {
    return this.userService.getAllUsers();
  }

  // Get user by email
  @Get(':email')
  @UseGuards(AccessTokenGuard)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserByEmailOrId(
    @Param('email') email: string,
  ): Promise<IResponse<User>> {
    return this.userService.findOneByEmail(email);
  }

  // Get user by id
  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<User>> {
    return this.userService.getUserById(+id);
  }

  // Update user data
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse<User>> {
    return this.userService.updateUserData(id, updateUserDto);
  }

  // Delete user by id
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<number>> {
    return this.userService.deleteUser(id);
  }
}
