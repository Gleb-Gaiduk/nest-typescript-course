import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './../services/users.service';
import { UserByIdPipe } from './user-by-id.pipe';

describe('UserByIdPipe', () => {
  let pipe: UserByIdPipe;

  const user = { id: 1 };

  const usersService = {
    async findOne(id: number) {
      return id === 1 ? user : null;
    },
  } as UsersService;

  beforeEach(() => {
    pipe = new UserByIdPipe(usersService);
  });
  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return user by id', () => {
    expect(pipe.transform('1')).toBeInstanceOf(Promise);
    expect(pipe.transform('1')).resolves.toMatchObject(user);
  });

  it('should throw BadRequestException', () => {
    expect(pipe.transform('ertg')).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException', () => {
    expect(pipe.transform('2')).rejects.toThrow(NotFoundException);
  });
});
