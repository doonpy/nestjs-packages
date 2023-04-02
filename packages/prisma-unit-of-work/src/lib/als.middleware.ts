import type { NestMiddleware } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import type { AlsService } from './als.service';
import { ALS_SERVICE } from './constants';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(@Inject(ALS_SERVICE) private readonly _alsService: AlsService) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const runner = this._alsService.run.bind(this._alsService);
    return runner(() => {
      try {
        next();
      } catch (e) {
        next(e);
      }
    });
  }
}
