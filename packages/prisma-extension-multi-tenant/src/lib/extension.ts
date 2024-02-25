import { Prisma } from '@prisma/client/extension';
import * as assert from 'assert';

import { AlsService } from './als-service';
import { TENANT_ID_STORE_KEY } from './constants';
import type { TenantManagerOptions } from './tenant-manager';
import { TenantManager } from './tenant-manager';

export const withMultiTenants = (
  options: Omit<TenantManagerOptions, 'clientConstructor'>
) =>
  Prisma.defineExtension((client) => {
    const PrismaClient = Object.getPrototypeOf(client).constructor;
    const datasourceName = Object.keys(options).find(
      (key) => !key.startsWith('$')
    );
    if (!datasourceName) {
      throw new Error(`Tenant options must specify a datasource`);
    }

    const tenantMap = options.tenantMap;
    assert(Array.isArray(tenantMap), 'Tenant map must be an array');
    assert(tenantMap.length > 0, 'At least one tenant must be specified');
    const tenantManager = TenantManager.getInstance();
    tenantManager.init({ ...options, clientConstructor: PrismaClient });

    return client.$extends({
      name: 'prisma-multi-tenants',
      client: {
        async $connect() {
          await tenantManager.connectAll();
        },
        async $disconnect() {
          await tenantManager.disconnectAll();
        },
        $pickTenant<T extends object>(this: T, tenantId: string) {
          return tenantManager.getClient(tenantId);
        },
      },
      query: {
        $allOperations({ args, model, operation }) {
          const cls = AlsService.getInstance();
          const tenantId = cls.get(TENANT_ID_STORE_KEY);
          if (!tenantId) {
            throw new Error('Tenant ID not found in execution context');
          }

          const tenantClient = tenantManager.getClient(tenantId);
          if (model) {
            return tenantClient[model][operation](args);
          }

          return tenantClient[operation](args);
        },
      },
    });
  });
