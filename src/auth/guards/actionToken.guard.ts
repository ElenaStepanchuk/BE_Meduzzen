import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ActionTokenGuard extends AuthGuard('jwt-action') {}
