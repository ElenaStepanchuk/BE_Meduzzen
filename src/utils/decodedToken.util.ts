import { ConfigService } from '@nestjs/config';

import * as jwt from 'jsonwebtoken';

export class DecodedToken {
  constructor(private configService: ConfigService) {}
  async decodedAccess(authHeader: string) {
    const headerBearer = authHeader.split(' ');
    const token = headerBearer[1];

    const secretAccess = this.configService.get<string>('JWT_SECRET_ACCESS');
    const decodedAccessToken = jwt.verify(token, secretAccess);
    return decodedAccessToken;
  }
  async decodedRefresh(authHeader: string) {
    const headerBearer = authHeader.split(' ');
    const token = headerBearer[1];
    const secretRefresh = this.configService.get<string>('JWT_SECRET_REFRESH');
    const decodedRefreshToken = jwt.verify(token, secretRefresh);
    return decodedRefreshToken;
  }
}

// export class DecodedAccessToken {
//   constructor(private configService: ConfigService) {}
//   async decoded(authHeader: string) {
//     const headerBearer = authHeader.split(' ');
//     const token = headerBearer[1];

//     const secret = this.configService.get<string>('JWT_SECRET_REFRESH');
//     const decodedToken = jwt.verify(token, secret);
//     return decodedToken;
//   }
// }
