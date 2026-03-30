import { useCallback, useEffect, useState } from 'react';
import { customerService } from '@/services/customerService';
import type { CustomerWithLoyalty } from '@/types/customer';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithLoyalty[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    const rows = await customerService.getCustomers();
    setCustomers(rows);
    setLoading(false);
  }, []);

  const grantManualStamp = useCallback(async (customerId: string, reason?: string) => {
    const updated = await customerService.grantManualLoyaltyStamp(customerId, reason);
    setCustomers((rows) => rows.map((customer) => (customer.id === customerId ? updated : customer)));
    return updated;
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return { customers, loading, refresh: loadCustomers, grantManualStamp };
};
