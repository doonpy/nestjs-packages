import { AsyncLocalStorage } from 'async_hooks';

export class AlsService {
  private static _instance: AlsService;
  private readonly _als: AsyncLocalStorage<Map<string | symbol, string>>;

  constructor() {
    this._als = new AsyncLocalStorage();
  }

  public static getInstance(): AlsService {
    if (!this._instance) {
      this._instance = new AlsService();
    }

    return this._instance;
  }

  public set(key: string | symbol, value: string): void {
    const store = this._als.getStore();
    if (!store) {
      throw new Error('Cannot set value outside of an execution context');
    }

    store.set(key, value);
  }

  public get(key: string | symbol): string | undefined {
    const store = this._als.getStore();
    if (!store) {
      throw new Error('Cannot get value outside of an execution context');
    }

    return store.get(key);
  }

  public run(callback: () => any) {
    if (this.isActive()) {
      return callback();
    }

    return this._als.run(new Map(), callback);
  }

  public enter() {
    if (!this.isActive()) {
      this._als.enterWith(new Map());
    }
  }

  private isActive() {
    return !!this._als.getStore();
  }
}
