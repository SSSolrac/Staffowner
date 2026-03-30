import { apiClient } from './client';
import type { CustomerProfile } from '@/types/customer';

export const customersApi = {
  list(): Promise<CustomerProfile[]> {
    return apiClient.get<CustomerProfile[]>('/api/customers');
  },
  getById(customerId: string): Promise<CustomerProfile> {
    return apiClient.get<CustomerProfile>(`/api/customers/${customerId}`);
  },
};
