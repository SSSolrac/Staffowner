import type { LoginHistoryEntry, LoginHistoryFilters } from '@/types/loginHistory';
import type { SessionUser } from '@/types/user';

export const loginHistoryService = {
  async recordLogin(_entry: Omit<LoginHistoryEntry, 'id'>) {
    // Login history is not part of the canonical shared backend contract.
    // Keep this as a no-op to avoid introducing a second backend model.
    return undefined;
  },

  async recordLogout(user: Pick<SessionUser, 'id' | 'name' | 'role'>) {
    void user;
    return undefined;
  },

  async getLoginHistory(filters: LoginHistoryFilters) {
    void filters;
    return { rows: [], total: 0 };
  },

  async getLoginStats() {
    return { totalToday: 0, failed: 0, staff: 0, customer: 0 };
  },
};
