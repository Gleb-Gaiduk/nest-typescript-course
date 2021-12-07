import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
