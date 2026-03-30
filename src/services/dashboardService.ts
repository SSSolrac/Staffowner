import { dashboardApi } from '@/api/dashboard';
import type { DashboardSummary } from '@/types/dashboard';

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return dashboardApi.getDashboardSummary();
  },
};
