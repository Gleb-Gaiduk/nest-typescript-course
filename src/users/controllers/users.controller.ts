import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersErrorDto } from '../dto/error.dto';
import { CreateUserDto, UserRemoveResponse } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from './../dto/user.dto';
import { UserByIdPipe } from './../pipes/user-by-id.pipe';

@Controller('users')
@ApiTags('Users')
@ApiResponse({
  status: 500,
  description: 'Unexpected error',
  type: UsersErrorDto,
})
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'q', required: false })
  async findAll(@Query() q: string): Promise<User[]> {
    return this.usersService.findAll(q);
  }

  @Get(':id')
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({
    status: 404,
    description: 'Id was not found in data base',
    type: UsersErrorDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException(`User of id ${id} was not found`);
    }

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe, ValidationPipe) id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param(':id') id: number): Promise<UserRemoveResponse> {
    const status = await this.usersService.remove(+id);

    return {
      status: status ? 'success' : 'error',
      removedId: id,
    };
  }

  @Get('/name/:id')
  @ApiParam({ name: 'id', type: Number })
  // Here 'id' is passsed to UserByIdPipe (custom pipe) and then it returns user: User
  getUserName(@Param('id', UserByIdPipe) user: User) {
    return { user };
  }
}
