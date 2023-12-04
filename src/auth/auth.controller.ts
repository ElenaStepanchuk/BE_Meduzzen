import {
  Controller,
  UseGuards,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Logger,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from 'src/types/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { IResponse } from 'src/types/Iresponse';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AUTH CONTROLLER');
  }
  logger: Logger;
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<string>> {
    return await this.authService.login(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await createUserDto;
  }
}
