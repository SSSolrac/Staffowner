import { customerService } from '@/services/customerService';
import type { DashboardData } from '@/types/dashboard';

const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const customers = await customerService.getCustomers();
    const totalCustomers = customers.length;

    return {
      kpis: [
        { label: 'Total customers', value: String(totalCustomers), helpText: 'Updated now' },
        { label: 'Total orders', value: '324', helpText: '+12% this week' },
        { label: 'Revenue', value: pesoFormatter.format(21430), helpText: '+8% this month' },
        { label: 'Active staff', value: '14', helpText: '2 on break' },
      ],
      tierSummary: [
        { tier: 'Gold', total: customers.filter((c) => c.tier === 'Gold').length },
        { tier: 'Silver', total: customers.filter((c) => c.tier === 'Silver').length },
        { tier: 'Bronze', total: customers.filter((c) => c.tier === 'Bronze').length },
        { tier: 'Unranked', total: customers.filter((c) => c.tier === 'Unranked').length },
      ],
    };
  },
};
