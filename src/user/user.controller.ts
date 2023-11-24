import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  Param,
  UseInterceptors,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
  // Query,
  // DefaultValuePipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
// import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger('USER CONTROLLER LOGGER');
  }

  // Get all users
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllUser(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send({
      status_code: HttpStatus.OK,
      detail: { data: users },
      result: 'We got all users',
    });
  }
  // @Get('/')
  // @HttpCode(HttpStatus.OK)
  // async getAllUser(
  //   @Res() res: Response,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // ): Promise<Pagination<IUser>> {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.userService.paginate({
  //     page,
  //     limit,
  //     route: '/',
  //   });
  // }
  //   const users = await this.userService.getAllUsers();
  //   return res.send({
  //     status_code: HttpStatus.OK,
  //     detail: { data: users },
  //     result: 'We got all users',
  //   });
  // }

  // Get user by id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const userData = await this.userService.getUserData(id);

    return res.send({
      status_code: HttpStatus.OK,
      data: userData,
      result: `User width id:${id} found.`,
    });
  }

  // Registor new user
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor(''))
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.userService.createUser(req.body);
    return res.send({
      status_code: HttpStatus.CREATED,
      result: 'New user created',
    });
  }

  // Update user data
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    this.userService.updateUserData(id, body);
    return res.send({
      status_code: HttpStatus.OK,
      result: `User width id:${id} updated.`,
    });
  }

  // Delete user by id
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    this.userService.deleteUser(id);
    return res.send({
      status_code: HttpStatus.OK,
      result: `User width id:${id} deleted.`,
    });
  }
}
