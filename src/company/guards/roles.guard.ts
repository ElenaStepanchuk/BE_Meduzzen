import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { DecodedToken } from 'src/utils/decodedToken.util';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {
    this.logger = new Logger('ROLES GUARD');
  }
  logger: Logger;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    const getOnlyToken = new DecodedToken(this.configService);
    const decodedToken = await getOnlyToken.decoded(authHeader);
    const { email } = decodedToken as { email: string };

    const member = await this.memberRepository.find({
      where: { user: email, role: 'owner' },
    });

    if (!member)
      throw new BadRequestException(
        'You can do any operations only in your own company!',
      );

    return true;
  }
}
