import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
  { label: 'Activity Log', path: '/admin/activity-log', ownerOnly: true },
  { label: 'Login History', path: '/admin/login-history', ownerOnly: true },
  { label: 'Staff Management', path: '/admin/staff', ownerOnly: true },
];

export const CommandBar = () => {
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  const filtered = useMemo(
    () => links
      .filter((item) => !item.ownerOnly || user?.role === 'owner')
      .filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query, user?.role],
  );

  return (
    <div className="relative">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Quick search" className="rounded border px-2 py-1 text-sm w-48" />
      {query && (
        <div className="absolute z-10 mt-1 w-full rounded border bg-white dark:bg-slate-800 p-1">
          {filtered.map((item) => (
            <Link key={item.path} to={item.path} className="block rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
              {item.label}
            </Link>
          ))}
          {filtered.length === 0 && <p className="px-2 py-1 text-xs text-slate-500">No results</p>}
        </div>
      )}
    </div>
  );
};
