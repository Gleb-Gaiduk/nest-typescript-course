import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
  AuthRegisterResponse,
} from './../dto/auth.dto';
import { UsersService } from './../services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() data: AuthRegisterDto): Promise<AuthRegisterResponse> {
    // TO DO hash password
    const user = await this.usersService.create({
      ...data,
      password: this.authService.encodePassword(data.password),
    });
    return {
      user,
    };
  }

  @Post('login')
  // @UsePipes(new ValidationPipe({ transform: false }))
  @UsePipes(new ValidationPipe({ transform: true }))
  // true - you will have AuthLoginDto class instanse inside  login method but not a simple object
  async login(@Body() credentials: AuthLoginDto): Promise<AuthLoginResponse> {
    // console.log(credentials.createdAt.getTime());

    const user = await this.authService.findByCredentials(
      credentials.email,
      credentials.password,
    );

    if (!user) throw new UnauthorizedException({}, 'Credentials invalid');

    const token = await this.authService.encodeUserToken(user);

    return { token, user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@Auth() user: User) {
    return user;
  }
}
