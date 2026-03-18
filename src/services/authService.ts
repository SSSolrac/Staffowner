import { loginHistoryService } from '@/services/loginHistoryService';
import type { SessionUser, UserRole } from '@/types/user';

const users: Record<string, SessionUser> = {
  'owner@happytails.com': {
    id: 'u1',
    name: 'Olivia Owner',
    email: 'owner@happytails.com',
    role: 'owner',
    token: 'owner-token',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Olivia%20Owner',
  },
  'staff@happytails.com': {
    id: 'u2',
    name: 'Sean Staff',
    email: 'staff@happytails.com',
    role: 'staff',
    token: 'staff-token',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Sean%20Staff',
  },
};

export const authService = {
  async login(email: string, password: string, role: UserRole, device: string): Promise<SessionUser> {
    const found = users[email];
    const status = found && found.role === role && password.length > 0 ? 'success' : 'failed';

    await loginHistoryService.recordLogin({
      userId: found?.id ?? 'unknown',
      userName: found?.name ?? email,
      role,
      loginTime: new Date().toISOString(),
      logoutTime: '',
      ipAddress: '127.0.0.1',
      device,
      loginStatus: status,
    });

    if (status === 'failed' || !found) throw new Error('Invalid credentials for selected role.');
    return found;
  },
};
