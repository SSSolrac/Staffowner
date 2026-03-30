import { apiClient } from './client';
import type { LoyaltyAccount } from '@/types/loyalty';

export const loyaltyApi = {
  getLoyaltyAccount(customerId: string): Promise<LoyaltyAccount> {
    return apiClient.get<LoyaltyAccount>(`/api/loyalty/${customerId}`);
  },
};
