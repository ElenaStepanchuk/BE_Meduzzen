import {
  Controller,
  UseGuards,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Logger,
  Body,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from 'src/types/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { IResponse } from 'src/types/Iresponse';
import { User } from 'src/user/entities/user.entity';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AUTH CONTROLLER');
  }
  logger: Logger;

  @UseGuards(AuthGuard('jwt'))
  @Post('registration')
  @UsePipes(new ValidationPipe())
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<User>> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<object>> {
    return this.authService.login(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Body() id: number) {
    this.authService.logout(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(id: number) {
    return this.authService.refreshTokens(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
