import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsersErrorDto } from '../dto/error.dto';
import { User, UserRoleName } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users/admin')
@ApiResponse({
  status: 500,
  description: 'Unexpected error',
  type: UsersErrorDto,
})
export class UsersAdminController {
  // access usersService inside this controller
  constructor(private usersService: UsersService) {}

  @Post('user/:userId/role/:roleName')
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  async addRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: UserRoleName,
  ): Promise<User> {
    const userWithNewRole = await this.usersService.addRole(+userId, roleName);

    if (!userWithNewRole) {
      throw new NotFoundException(
        `Error wlile creating new role for a user with id ${userId}`,
      );
    }

    return userWithNewRole;
  }

  @Delete()
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: UserRoleName,
  ): Promise<User> {
    return this.usersService.removeRole(+userId, roleName);
  }
}
