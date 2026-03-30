import { customersApi } from '@/api/customers';
import { loyaltyService } from '@/services/loyaltyService';
import type { CustomerWithLoyalty } from '@/types/customer';

export const customerService = {
  async getCustomers(): Promise<CustomerWithLoyalty[]> {
    const customers = await customersApi.list();

    return Promise.all(customers.map(async (customer) => ({
      ...customer,
      loyalty: await loyaltyService.getCustomerLoyalty(customer.id),
    })));
  },

  async grantManualLoyaltyStamp(customerId: string): Promise<CustomerWithLoyalty> {
    const customer = await customersApi.getById(customerId);
    return {
      ...customer,
      loyalty: await loyaltyService.getCustomerLoyalty(customer.id),
    };
  },
};
