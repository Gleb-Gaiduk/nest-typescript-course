import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Justyna', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'just@gmail.com' })
  email: string;

  @ApiProperty({ example: '!sdfdf#@' })
  password: string;
}

export class CreateUserResponse {
  user: User;
}

export class UpdateUserDto {
  name: string;
  email: string;
}

export class UpdateUserResponse {
  user: User;
}

export class UserRemoveResponse {
  status: 'error' | 'success';
  removedId: number;
}
