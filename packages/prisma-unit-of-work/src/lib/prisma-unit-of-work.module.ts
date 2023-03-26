import type {
  DynamicModule,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';

import { AlsMiddleware } from './als.middleware';
import { AlsService } from './als.service';
import { ALS_SERVICE, PRISMA_CLIENT } from './constants';
import type { PrismaUnitOfWorkModuleOptions } from './typing';

export class PrismaUnitOfWorkModule implements NestModule {
  public static forRoot(options: PrismaUnitOfWorkModuleOptions): DynamicModule {
    return {
      module: PrismaUnitOfWorkModule,
      global: options.global,
      providers: [
        { provide: ALS_SERVICE, useValue: new AlsService() },
        { provide: PRISMA_CLIENT, useClass: options.prismaClient },
      ],
      exports: [PRISMA_CLIENT, ALS_SERVICE],
    };
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
