import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('cat를 생성합니다.', async () => {
    // given
    const newCat = { name: 'cat7' };

    // when
    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(newCat);

    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch('/json');
    expect(response.body.hasOwnProperty('name')).toEqual(true);
  });
});
