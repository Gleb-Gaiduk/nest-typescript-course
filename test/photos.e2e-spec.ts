import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/users/services/auth.service';

describe('PhotosController (e2e)', () => {
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

  it.only('/photos/upload (POST) should upload photo', () => {
    const fixtureFileName = 'test.png';
    const fixtureFilePath = `./test/fixtures/${fixtureFileName}`;

    const reqBody = {
      description: 'Test',
      title: 'Test',
    };

    const resBody = {
      photo: expect.any(Object),
      body: reqBody,
    };

    return request(app.getHttpServer())
      .post('/photos/upload')
      .field('description', reqBody.description)
      .field('title', reqBody.title)
      .attach('file', readFileSync(fixtureFilePath), fixtureFileName)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
        // To do check if file exists and if there are thumbs created in storage
      });
  });
});
