import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestPayload, User } from './../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // TO DO validate api token from headers
    request.payload = {
      user: new User({
        name: 'Test mocked user',
      }),
      token: 'dsfd23r',
    } as RequestPayload;

    return Boolean(request.payload);
  }
}
