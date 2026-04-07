import { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/authService';
import type { SessionUser } from '@/types/user';

interface AuthContextType {
  user: SessionUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SESSION_KEY = 'staffowner_session';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  });

  useEffect(() => {
    let cancelled = false;
    authService.getCurrentUser().then((current) => {
      if (cancelled) return;
      setUser(current);
      if (current) localStorage.setItem(SESSION_KEY, JSON.stringify(current));
      else localStorage.removeItem(SESSION_KEY);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
