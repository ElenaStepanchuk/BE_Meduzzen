import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { DecodedToken } from 'src/utils/decodedToken.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompareUseGuard implements CanActivate {
  constructor(private configService: ConfigService) {
    this.logger = new Logger('CHECKUSER GUARD');
  }
  logger: Logger;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    const getOnlyToken = new DecodedToken(this.configService);
    const decodedToken = await getOnlyToken.decoded(authHeader);
    const { id } = decodedToken as { email: string; id: number };
    const user_id = parseInt(request.query.user_id, 10);

    if (id !== user_id)
      throw new BadRequestException(
        'You can do any operations only on your own user!',
      );

    return true;
  }
}
