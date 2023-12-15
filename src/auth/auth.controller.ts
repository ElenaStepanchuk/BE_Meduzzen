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
import { AccessTokenGuard } from './guards/accessToken.guard';
import { Auth0Guard } from './guards/auth0.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AUTH CONTROLLER');
  }
  logger: Logger;

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(ValidateUserGuard)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<object>> {
    return this.authService.login(createUserDto);
  }

  @Get('logout')
  logout(
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<boolean>> {
    return this.authService.logout(authHeader);
  }

  @Get('refresh')
  refreshTokens(@Headers('Authorization') authHeader: string): Promise<object> {
    return this.authService.refreshTokens(authHeader);
  }

  @UseGuards(AccessTokenGuard, new Auth0Guard('auth0'))
  @Get('me')
  getProfile(
    @Headers('Authorization') authHeader: string,
  ): Promise<IResponse<User>> {
    return this.authService.getProfile(authHeader);
  }
}
