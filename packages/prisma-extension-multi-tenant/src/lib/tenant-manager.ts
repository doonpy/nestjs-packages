import type { Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/extension';

export type ConfigureCallback = (client: PrismaClient) => PrismaClient;

export interface TenantManagerOptions {
  tenantMap: { tenantId: string; url: string }[];
  clientConstructor: typeof PrismaClient;
  configureCallBack?: ConfigureCallback;
  clientOptions?: Omit<
    Prisma.PrismaClientOptions,
    'datasources' | 'datasourceUrl'
  >;
}

export class TenantManager {
  private static _instance: TenantManager;
  private readonly _tenantClients: Map<string, PrismaClient>;

  constructor() {
    this._tenantClients = new Map();
  }

  public static getInstance(): TenantManager {
    if (!this._instance) {
      this._instance = new TenantManager();
    }
    return this._instance;
  }

  public init(options: TenantManagerOptions) {
    if (options.tenantMap.length === 0) {
      throw new Error('At least one tenant must be specified');
    }

    options.tenantMap.forEach((tenant) => {
      const client = new options.clientConstructor({
        ...options.clientOptions,
        datasources: { db: { url: tenant.url } },
      });
      if (options.configureCallBack) {
        this._tenantClients.set(
          tenant.tenantId,
          options.configureCallBack(client)
        );
      } else {
        this._tenantClients.set(tenant.tenantId, client);
      }
    });
  }

  public async connectAll() {
    await Promise.all(
      Array.from(this._tenantClients.values()).map((client) =>
        client.$connect()
      )
    );
  }

  public async disconnectAll() {
    await Promise.all(
      Array.from(this._tenantClients.values()).map((client) =>
        client.$disconnect()
      )
    );
  }

  public getClient(tenantId: string): PrismaClient {
    const client = this._tenantClients.get(tenantId);
    if (!client) {
      throw new Error(`Prisma for tenant ${tenantId} not found`);
    }

    return client;
  }
}
