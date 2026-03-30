import { loginHistoryService } from '@/services/loginHistoryService';
import type { SessionUser, UserRole } from '@/types/user';

const buildSessionUser = (email: string, role: UserRole): SessionUser => ({
  id: `session-${Date.now()}`,
  name: email.split('@')[0] || 'Staff User',
  email,
  role,
  token: `session-${Math.random().toString(36).slice(2)}`,
});

export const authService = {
  async login(email: string, password: string, role: UserRole, device: string): Promise<SessionUser> {
    if (!email || !password) throw new Error('Email and password are required.');

    const session = buildSessionUser(email, role);

    await loginHistoryService.recordLogin({
      userId: session.id,
      userName: session.name,
      role,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      ipAddress: null,
      device,
      loginStatus: 'success',
    });

    return session;
  },
};
