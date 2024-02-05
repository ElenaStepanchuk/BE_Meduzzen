import {
  Controller,
  UseGuards,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Logger,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUserGuard } from './guards/validateUser.guard';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { IResponse } from 'src/types/Iresponse';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AUTH CONTROLLER');
  }
  logger: Logger;

  @Post('registration')
  @UseGuards(ValidateUserGuard)
  @UsePipes(new ValidationPipe())
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<object>> {
    return this.authService.login(createUserDto);
  }

  @UseGuards(AuthGuard(['auth0', 'jwt']))
  @Post('logout')
  logout(
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<boolean>> {
    return this.authService.logout(authHeader);
  }

  @Get('refresh')
  refreshTokens(
    @Headers('Authorization') refreshHeader: string,
  ): Promise<object> {
    return this.authService.refreshTokens(refreshHeader);
  }

  @UseGuards(AuthGuard(['auth0', 'jwt']))
  @Get('me')
  getProfile(
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<User>> {
    return this.authService.getProfile(authHeader);
  }
}
