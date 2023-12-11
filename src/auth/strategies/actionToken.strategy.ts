import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ActionTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-action',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: configService.get('AUTH0_SERVER_UR'),
    });
  }

  async validate(req: Request, payload: any) {
    const actionToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, actionToken };
  }
}
