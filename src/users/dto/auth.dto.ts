import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthLoginDto {
  @ApiProperty({ example: 'Justyna@gmail.com' })
  email: string;
  @ApiProperty({ example: 'dfsdf2fds' })
  password: string;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}

export class AuthRegisterDto {
  @ApiProperty({ example: 'Justyna' })
  name: string;
  @ApiProperty({ example: 'Justyna@gmail.com' })
  email: string;
  @ApiProperty({ example: 'dfsdf2fds' })
  password: string;
}

export class AuthRegisterResponse {
  user: User;
}
