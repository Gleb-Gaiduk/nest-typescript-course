import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '../../config';

@Catch()
// Will catch only no found exceptions
// @Catch(NotFoundException)
export class UserExceptionFilter<T> implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.status || 500;
    const userId = request?.payload?.user?.id || null;

    const data = {
      statusCode: status,
      userId,
      errorStack: this.configService.DEBUG ? exception.stack : null,
      errorMessage: this.configService.DEBUG ? exception.message : null,
    };

    // TO DO implement internal logging

    response.status(status).json(data);
  }
}
