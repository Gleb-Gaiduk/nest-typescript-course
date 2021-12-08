import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PerformanceInterceptor } from './users/interceptors/performance.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Adding interceptor globally for whole app
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}
