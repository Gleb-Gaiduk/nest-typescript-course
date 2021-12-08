import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleName } from './../entities/user.entity';
import { AuthService } from './../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) return false;

    request.token = await this.authService.decodeUserToken(token);

    if (!request.payload) {
      return false;
    }

    const requiredRoles: UserRoleName[] = this.reflector.getAllAndOverride(
      'roles',
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) {
      return true;
    }

    const userRoles: UserRoleName[] = request.payload.user.roles.map(
      (role) => role.name,
    );

    return requiredRoles.some((role) => userRoles.includes(role));
  }

  extractToken(request): string {
    const token = request.heasers['authorization'];
    return token ? token.replace('Bearer ', '') : '';
  }
}
