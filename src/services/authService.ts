import { supabase } from '@/lib/supabase';
import { asRecord, mapUserRole } from '@/lib/mappers';
import type { SessionUser } from '@/types/user';

const asAuthError = (error: unknown, fallback = 'Authentication failed.') => {
  const message = asRecord(error)?.message;
  if (typeof message === 'string' && message.trim()) return new Error(message);
  if (error instanceof Error && error.message.trim()) return new Error(error.message);
  return new Error(fallback);
};

const asDbError = (error: unknown, fallback = 'Database request failed.') => {
  const message = asRecord(error)?.message;
  if (typeof message === 'string' && message.trim()) return new Error(message);
  if (error instanceof Error && error.message.trim()) return new Error(error.message);
  return new Error(fallback);
};

const buildSessionUser = (params: { userId: string; email: string; name: string; role: SessionUser['role'] }): SessionUser => ({
  id: params.userId,
  name: params.name,
  email: params.email,
  role: params.role,
});

const fetchProfileForUserId = async (userId: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw asDbError(error, 'Unable to load your profile.');
  if (!data) throw new Error('Profile row missing for this user.');
  return data;
};

export const authService = {
  async login(email: string, password: string): Promise<SessionUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw asAuthError(error, 'Invalid email or password.');
    const user = data.user;
    if (!user) throw new Error('Unable to sign in.');

    const profile = await fetchProfileForUserId(user.id);
    const role = mapUserRole(profile.role);

    if (role !== 'owner' && role !== 'staff') {
      try {
        await supabase.auth.signOut();
      } catch {}
      throw new Error('This account is not allowed to access Staffowner.');
    }

    return buildSessionUser({
      userId: user.id,
      email: String(profile.email ?? user.email ?? ''),
      name: String(profile.name ?? user.user_metadata?.name ?? user.email ?? ''),
      role,
    });
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw asAuthError(error, 'Unable to sign out.');
  },

  async getCurrentUser(): Promise<SessionUser | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw asAuthError(error, 'Unable to restore session.');
    const session = data.session;
    if (!session?.user) return null;

    const user = session.user;
    const profile = await fetchProfileForUserId(user.id);
    const role = mapUserRole(profile.role);
    if (role !== 'owner' && role !== 'staff') return null;

    return buildSessionUser({
      userId: user.id,
      email: String(profile.email ?? user.email ?? ''),
      name: String(profile.name ?? user.user_metadata?.name ?? user.email ?? ''),
      role,
    });
  },
};
