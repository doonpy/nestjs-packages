import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

const als = new AsyncLocalStorage<{ client?: any }>();

@Injectable()
export class AlsService {
  private readonly _als: AsyncLocalStorage<{ client?: any }> = als;

  public run<T = any>(callback: () => T) {
    return this._als.run({}, callback);
  }

  public setClient<Client>(client: Client): void {
    const store = this._als.getStore();
    if (!store) {
      throw new Error(
        'No CLS context available, please make sure that a ClsMiddleware/Guard/Interceptor has set up the context, or wrap any calls that depend on CLS with "ClsService#run"'
      );
    }

    store.client = client;
  }

  public getClient<Client>(): Client {
    const store = this._als.getStore();
    if (!store) {
      throw new Error(
        'No CLS context available, please make sure that a ClsMiddleware/Guard/Interceptor has set up the context, or wrap any calls that depend on CLS with "ClsService#run"'
      );
    }

    return store.client as Client;
  }
}
