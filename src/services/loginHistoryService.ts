import { authApi } from '@/api/auth';
import type { LoginHistoryEntry, LoginHistoryFilters } from '@/types/loginHistory';

const defaultFilters: LoginHistoryFilters = {
  query: '',
  role: 'all',
  status: 'all',
  date: '',
  page: 1,
  pageSize: 200,
};

export const loginHistoryService = {
  async recordLogin(entry: Omit<LoginHistoryEntry, 'id'>) {
    return authApi.recordLoginHistory(entry);
  },

  async recordLogout(userId: string) {
    await authApi.recordLoginHistory({
      userId,
      userName: 'Session User',
      role: 'staff',
      loginTime: new Date().toISOString(),
      logoutTime: new Date().toISOString(),
      ipAddress: null,
      device: null,
      loginStatus: 'success',
    });
  },

  async getLoginHistory(filters: LoginHistoryFilters) {
    return authApi.listLoginHistory(filters);
  },

  async getLoginStats() {
    const { rows } = await authApi.listLoginHistory(defaultFilters);
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = rows.filter((entry) => entry.loginTime.startsWith(today));

    return {
      totalToday: todayEntries.length,
      failed: todayEntries.filter((entry) => entry.loginStatus === 'failed').length,
      staff: todayEntries.filter((entry) => entry.role === 'staff').length,
      customer: todayEntries.filter((entry) => entry.role === 'customer').length,
    };
  },
};
