import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  // Access to UsersService via dependency injection
  constructor(private usersService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<User> {
    const id = parseInt(value, 10);

    if (!id) {
      throw new BadRequestException('Id param validation failed');
    }

    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return user;
  }
}
