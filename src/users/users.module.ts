import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config';
import { ConfigService } from './../config/config.service';
import { UsersAdminController } from './controllers/user-admin.controller';
import { AuthController } from './controllers/user-auth.controller';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '4d' },
      }),
    }),
  ],
  controllers: [UsersController, AuthController, UsersAdminController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
