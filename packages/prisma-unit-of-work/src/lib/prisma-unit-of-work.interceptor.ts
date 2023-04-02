import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';

import type { AlsService } from './als.service';
import { ALS_SERVICE, PRISMA_SERVICE } from './constants';
import type { PrismaClientPrototype } from './typing';

@Injectable()
export class PrismaUnitOfWorkInterceptor implements NestInterceptor {
  constructor(
    @Inject(ALS_SERVICE)
    private readonly _alsService: AlsService,
    @Inject(PRISMA_SERVICE)
    private readonly _prismaClient: PrismaClientPrototype
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    return this._prismaClient.$transaction((client) => {
      this._alsService.setClient(client);

      return lastValueFrom(next.handle());
    });
  }
}
