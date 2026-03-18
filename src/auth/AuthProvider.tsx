import { createContext, useMemo, useState } from 'react';
import { authService } from '@/services/authService';
import { loginHistoryService } from '@/services/loginHistoryService';
import type { SessionUser, UserRole } from '@/types/user';

interface AuthContextType {
  user: SessionUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (payload: Partial<Pick<SessionUser, 'name' | 'avatar'>>) => void;
}

const SESSION_KEY = 'staffowner_session';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  });

  const login = async (email: string, password: string, role: UserRole) => {
    const session = await authService.login(email, password, role, navigator.userAgent);
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const logout = async () => {
    if (user) await loginHistoryService.recordLogout(user.id);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (payload: Partial<Pick<SessionUser, 'name' | 'avatar'>>) => {
    setUser((previous) => {
      if (!previous) return null;
      const next = { ...previous, ...payload };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({ user, login, logout, updateUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
