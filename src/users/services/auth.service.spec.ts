import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users.module';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  const user = { id: 1, email: 'piotr@myflow.pl' } as User;

  // Create mocked usersService to avoid connecting to DB for tests
  const usersService = {
    async findBy(data: Partial<User>) {
      return data.id === 1 ? [user] : [];
    },
  } as UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encode & decode jwt token', async () => {
    const token = await service.encodeUserToken(user);
    expect(typeof token).toBe('string');
    const payload = await service.decodeUserToken(token);
    expect(payload).toMatchObject({ user, token: expect.any(String) });
  });
});
