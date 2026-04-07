import { loyaltyService } from '@/services/loyaltyService';
import type { CustomerWithLoyalty } from '@/types/customer';
import { supabase } from '@/lib/supabase';
import { asRecord, mapCustomerProfileRow } from '@/lib/mappers';

const asDbError = (error: unknown, fallback = 'Database request failed.') => {
  const message = asRecord(error)?.message;
  if (typeof message === 'string' && message.trim()) return new Error(message);
  if (error instanceof Error && error.message.trim()) return new Error(error.message);
  return new Error(fallback);
};

const loadCustomerProfile = async (customerId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', customerId).maybeSingle();
  if (error) throw asDbError(error, 'Unable to load customer profile.');
  if (!data) throw new Error('Customer profile not found.');
  return mapCustomerProfileRow(data);
};

export const customerService = {
  async getCustomers(): Promise<CustomerWithLoyalty[]> {
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'customer');
    if (error) throw asDbError(error, 'Unable to load customers.');

    const customers = (Array.isArray(data) ? data : []).map(mapCustomerProfileRow);
    const loyaltyByCustomerId = await loyaltyService.getCustomersLoyalty(customers.map((c) => c.id));

    return customers.map((customer) => ({
      ...customer,
      loyalty: loyaltyByCustomerId[customer.id] ?? {
        customerId: customer.id,
        stampCount: 0,
        availableRewards: [],
        redeemedRewards: [],
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  async getCustomerById(customerId: string): Promise<CustomerWithLoyalty> {
    const [customer, loyalty] = await Promise.all([loadCustomerProfile(customerId), loyaltyService.getCustomerLoyalty(customerId)]);
    return { ...customer, loyalty };
  },
};
