import { loyaltyApi } from '@/api/loyalty';
import type { Order } from '@/types/order';
import type { LoyaltyAccount } from '@/types/loyalty';

export const loyaltyService = {
  canGrantStamp(order: Order): boolean {
    return order.paymentStatus === 'paid' && Boolean(order.customerId);
  },

  hasOrderAlreadyBeenStamped(order: Order | string): boolean {
    if (typeof order === 'string') return false;
    return order.loyaltyStampStatus === 'already-stamped';
  },

  async getCustomerLoyalty(customerId: string): Promise<LoyaltyAccount> {
    return loyaltyApi.getLoyaltyAccount(customerId);
  },
};
