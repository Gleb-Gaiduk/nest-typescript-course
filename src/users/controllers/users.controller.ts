import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDto } from '../dto/error.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false })
  async findAll(@Query() q: string): Promise<User[]> {
    return this.usersService.findAll(q);
  }

  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'Id was not found in data base',
    type: ErrorDto,
  })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException(`User of id ${id} was not found`);
    }

    return user;
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
