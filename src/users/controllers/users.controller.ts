import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false })
  findAll(@Query() q: string) {
    return this.usersService.findAll(q);
  }

  findOne(id: string) {
    return this.usersService.findOne(+id);
  }

  create(createUserDto) {
    return this.usersService.create(createUserDto);
  }

  update(id: string, updateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  remove(id: string) {
    return this.usersService.remove(+id);
  }
}
