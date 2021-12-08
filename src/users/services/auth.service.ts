import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, User } from '../entities/user.entity';
import { RequestPayload } from './../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string): Promise<User | null> {}

  async findByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const [user] = await this.usersService.findBy({ email });

    if (!this.validatePassword(password, user.password)) return null;

    return user;
  }

  encodePassword(password: string) {
    return password;
  }

  validatePassword(password: string, hash: string) {
    return password === hash;
  }

  async encodeUserToken(user: User): Promise<string> {
    const payload: TokenPayload = { username: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload | null> {
    const payload: TokenPayload = this.jwtService.verify(token);

    const [user] = await this.usersService.findBy({ id: payload.sub });

    return user ? { user, token } : null;
  }
}
