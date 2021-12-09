import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
  AuthRegisterResponse,
} from '../src/users/dto/auth.dto';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/users/services/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const authService = await app.get(AuthService);
    token = await authService.encodeUserToken({ id: 1 } as User);

    await app.init();
  });

  it('/auth/register (GET) should return 400 Bed Request', () => {
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it('/auth/register (POST) should create user', () => {
    const reqBody: AuthRegisterDto = {
      name: 'Piotr',
      email: 'piotr@myflow.pl',
      password: '123',
    };

    const resBody: AuthRegisterResponse = {
      user: {
        name: 'Piotr',
        id: expect.any(Number),
        email: 'piotr@myflow.pl',
      },
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(reqBody)
      .expect(201)
      .then((res) => expect(res.body).toMatchObject(resBody));
  });

  it('/auth/login (POST) should login a user', () => {
    const reqBody: AuthLoginDto = {
      email: 'piotr@myflow.pl',
      password: '123',
    };
    const resBody: AuthLoginResponse = {
      token: expect.any(String),
      user: {
        name: 'Piotr',
        id: expect.any(Number),
        email: 'piotr@myflow.pl',
      },
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(reqBody)
      .expect(201)
      .then((res) => {
        token = res.body.token;
        expect(res.body).toMatchObject(resBody);
      });
  });

  it('/auth/me (GET) should return 403 Forbidden resource', () => {
    return request(app.getHttpServer())
      .get('/auth/me')
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.statusCode).toBe(403);
      });
  });

  it.only('/auth/me (GET) should return logged in user', () => {
    const resBody: User = {
      name: 'Piotr',
      id: expect.any(Number),
      email: 'piotr@myflow.pl',
    };

    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
      });
  });
});
