import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthLoginDto {
  @ApiProperty({ example: 'piotr@myflow.pl' })
  @IsEmail({})
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123' })
  @MinLength(3)
  @IsString()
  password: string;

  @Transform((value) => new Date(v.value))
  createdAt?: Date;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}

export class AuthRegisterDto {
  @ApiProperty({ example: 'Piotr' })
  name: string;
  @ApiProperty({ example: 'Justyna@gmail.com' })
  email: string;
  @ApiProperty({ example: '123' })
  password: string;
}

export class AuthRegisterResponse {
  user: User;
}
