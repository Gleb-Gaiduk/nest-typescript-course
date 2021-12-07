import { Module } from '@nestjs/common';
import { UsersAdminController } from './controllers/user-admin.controller';
import { AuthController } from './controllers/user-auth.controller';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController, AuthController, UsersAdminController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
