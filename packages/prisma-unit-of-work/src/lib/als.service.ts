import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

import type { AlsStore } from './typing';

const als = new AsyncLocalStorage<AlsStore>();

@Injectable()
export class AlsService {
  private readonly _als: AsyncLocalStorage<AlsStore> = als;

  public run<T = unknown>(callback: () => T) {
    return this._als.run({}, callback);
  }

  public setClient<Client extends Omit<AlsStore, '$transaction'>>(
    client: Client
  ): void {
    const store = this._als.getStore();
    if (!store) {
      throw new Error('No ALS context available.');
    }

    store.client = client;
  }

  public getClient<Client>(): Client {
    const store = this._als.getStore();
    if (!store) {
      throw new Error('No ALS context available');
    }

    return store.client as Client;
  }
}
