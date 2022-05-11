import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { disconnect } from 'mongoose';

const testCreateUserDto: CreateUserDto = {
  userName: 'test name',
  userEmail: 'test@test.com',
  userPassword: ')KCx&)Y^t3KbPT%+',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send(testCreateUserDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        expect(body._id).toBeDefined();
      });
  });

  it('/user/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send({
        userName: 123,
        userEmail: 'isNotAnEmailAddress',
        userPassword: 123,
      })
      .expect(400);
  });

  it('/user/all/list (GET) - success', async () => {
    return request(app.getHttpServer()).get('/user/all/list').expect(200);
  });

  // it('/user/update (PATCH)', async () => {
  //   return request(app.getHttpServer())
  //     .post('/user/update')
  //     .send({
  //       userId: createdUserId,
  //       userName: 'updated test name',
  //       userEmail: 'updatedTest@test.com',
  //     })
  //     .expect(200);
  // });

  // it('/user/delete (DELETE)', async () => {
  //   return request(app.getHttpServer())
  //     .post('/user/delete/' + createdUserId)
  //     .expect(200);
  // });

  afterAll(() => {
    disconnect();
  });
});
