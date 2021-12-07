import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestPayload, User } from '../entities/user.entity';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | undefined => {
    const request = context.switchToHttp().getRequest();
    const payload: RequestPayload = request.payload;

    return payload ? payload.user : undefined;
  },
);
