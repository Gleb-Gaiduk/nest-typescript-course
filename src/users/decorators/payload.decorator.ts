import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestPayload } from './../entities/user.entity';

export const Payload = createParamDecorator(
  (key: keyof RequestPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: RequestPayload = request.payload;

    if (payload && key) {
      return payload[key];
    }

    return payload;
  },
);
