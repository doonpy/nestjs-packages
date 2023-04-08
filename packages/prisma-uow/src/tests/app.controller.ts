import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import type { AlsService } from '../lib/als.service';
import { ALS_SERVICE } from '../lib/constants';
import { PrismaUnitOfWorkInterceptor } from '../lib/prisma-unit-of-work.interceptor';
import type { PrismaService } from './prisma.service';

@UseInterceptors(PrismaUnitOfWorkInterceptor)
@Controller()
export class AppController {
  constructor(@Inject(ALS_SERVICE) private readonly _alsService: AlsService) {}

  @Post('/users')
  public async createUser(
    @Body()
    data: {
      email: string;
      name: string;
      posts: Array<{ title: string; content: string; published: boolean }>;
    }
  ) {
    const prismaClient = this._alsService.getClient<PrismaService>();
    const { posts, ...props } = data;

    const user = await prismaClient.user.create({ data: props });
    const createdPosts = await Promise.all(
      posts.map((post) =>
        prismaClient.post.create({ data: { ...post, authorId: user.id } })
      )
    );

    return { ...user, posts: createdPosts };
  }
}
