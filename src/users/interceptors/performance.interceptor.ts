import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { fromEvent, map, Observable, takeUntil, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // TO DO modify request

    const close$ = fromEvent(request, 'close');

    console.time('Request duration');

    // .pipe - do the stuff on the way back
    return next.handle().pipe(
      // TO DO mutate response
      // res - receiving from controller
      map((res) => res),
      tap((res) => console.timeEnd('Request duration')),
      takeUntil(close$),
    );
  }
}
