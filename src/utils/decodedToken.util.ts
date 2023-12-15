import { ConfigService } from '@nestjs/config';

import * as jwt from 'jsonwebtoken';

export class DecodedToken {
  constructor(private configService: ConfigService) {}
  async decoded(authHeader: string) {
    const headerBearer = authHeader.split(' ');
    const token = headerBearer[1];

    const secret = this.configService.get<string>('JWT_SECRET_ACCESS');
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  }
}
