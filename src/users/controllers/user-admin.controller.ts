import {
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UsersErrorDto } from '../dto/error.dto';
import { User, UserRoleName } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { UserExceptionFilter } from './../filters/user-exception.filter';

@Controller('users/admin')
@ApiTags('Users Admin')
@ApiResponse({
  status: 500,
  description: 'Unexpected error',
  type: UsersErrorDto,
})
@UseGuards(JwtAuthGuard)
@Roles(UserRoleName.ROOT)
@UseFilters(UserExceptionFilter)
export class UsersAdminController {
  // access usersService inside this controller
  constructor(private usersService: UsersService) {}

  @Post('user/:userId/role/:roleName')
  @ApiBearerAuth()
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  async addRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: UserRoleName,
    @Auth() user: User,
  ): Promise<User> {
    const userWithNewRole = await this.usersService.addRole(+userId, roleName);

    if (!userWithNewRole) {
      throw new InternalServerErrorException('TEST EXCEPTION');
    }
    return userWithNewRole;
  }

  @Delete('user/:userId/role/:roleName')
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: UserRoleName,
    @Payload('user') payload: any,
  ): Promise<User> {
    return this.usersService.removeRole(+userId, roleName);
  }
}
