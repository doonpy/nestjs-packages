import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { PRISMA_SERVICE } from '../lib/constants';
import { AppModule } from './app.module';
import type { PrismaService } from './prisma.service';

describe('PrismaUnitOfWorkModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const prismaClient = app.get<PrismaService>(PRISMA_SERVICE);
    await prismaClient.user.deleteMany({});
  });

  it('should create user with posts', () => {
    const user = {
      email: `user${Date.now()}@example.com`,
      name: `user${Date.now()}`,
      posts: [
        {
          title: 'Post 1',
          content: 'Post 1',
          published: false,
        },
        {
          title: 'Post 2',
          content: 'Post 2',
          published: true,
        },
      ],
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect((res) => {
        expect(JSON.parse(res.text)).toMatchObject(user);
      });
  });
});
