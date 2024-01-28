import { Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class GetTokens {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger('AUTH SERVICE');
  }
  logger: Logger;

  async getTokens(id: number, email: string): Promise<object> {
    try {
      const accessToken: string = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACCESS'),
          expiresIn: '5m',
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
          expiresIn: '1d',
        },
      );
      const actionToken = await this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_ACTION'),
          expiresIn: '1d',
        },
      );

      return {
        accessToken,
        refreshToken,
        actionToken,
      };
    } catch (error) {
      throw new HttpException(
        {
          status_code: HttpStatus.FORBIDDEN,
          error: 'Token not valid',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
