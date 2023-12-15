import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';
import { User } from '@auth0/auth0-spa-js';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private readonly configService: ConfigService) {
    super({
      domain: configService.get('AUTH0_DOMAIN'),
      clientID: configService.get('AUTH0_CLIENT_ID'),
      clientSecret: configService.get('AUTH0_SECRET'),
      callbackURL: configService.get('AUTH0_SERVER_URL'),
      scope: 'openid profile email',
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: User) {
    const user = {
      id: profile.id,
      email: profile.email,
    };
    return user;
  }
}
