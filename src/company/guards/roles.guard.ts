import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    this.logger = new Logger('ROLES GUARD');
  }
  logger: Logger;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    this.logger.warn('roles', roles);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    function matchRoles(roles: string[], userRoles: string[]): boolean {
      return userRoles.some((userRole) =>
        roles.find((role) => role === userRole),
      );
    }

    return matchRoles(roles, user.roles);
  }
}
