import { apiClient } from './client';
import type { LoginHistoryEntry, LoginHistoryFilters } from '@/types/loginHistory';

export const authApi = {
  recordLoginHistory(entry: Omit<LoginHistoryEntry, 'id'>): Promise<LoginHistoryEntry> {
    return apiClient.post<LoginHistoryEntry>('/api/auth/login-history', entry);
  },

  listLoginHistory(filters: LoginHistoryFilters): Promise<{ rows: LoginHistoryEntry[]; total: number }> {
    return apiClient.get<{ rows: LoginHistoryEntry[]; total: number }>('/api/auth/login-history', {
      query: filters.query,
      role: filters.role === 'all' ? undefined : filters.role,
      status: filters.status === 'all' ? undefined : filters.status,
      date: filters.date,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  },
};
