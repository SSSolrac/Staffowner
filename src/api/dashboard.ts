import { apiClient } from './client';
import type { DashboardSummary } from '@/types/dashboard';

export const dashboardApi = {
  getDashboardSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>('/api/dashboard/summary');
  },
};
