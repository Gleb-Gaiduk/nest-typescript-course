import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  @Get()
  getUsers() {
    return [
      { id: 1, name: 'Hleb ' },
      { id: 2, name: 'Piotr ' },
    ];
  }

  @Post()
  addUsers() {
    return { id: 22, name: 'New user' };
  }
}
