import { AlsService } from './als-service';
import { TENANT_ID_STORE_KEY } from './constants';

export function storeTenantId(tenantId: string): void {
  const cls = AlsService.getInstance();
  cls.enter();
  cls.set(TENANT_ID_STORE_KEY, tenantId);
}
