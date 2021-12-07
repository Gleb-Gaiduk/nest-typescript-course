import { SetMetadata } from '@nestjs/common';
import { UserRoleName } from './../entities/user.entity';

export const Roles = (...args: UserRoleName[]) => SetMetadata('roles', args);
