import { Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { CommandBar } from '@/components/navigation/CommandBar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { Image } from '@/components/ui';
import { notificationService } from '@/services/notificationService';
import { settingsService } from '@/services/settingsService';
import type { AppNotification } from '@/types/notification';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const isOwner = user?.role === 'owner';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    notificationService.list().then(setNotifications);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const openNotifications = () => {
    const settings = settingsService.getSettings();
    if (!settings.notificationsEnabled) {
      toast.info('Notifications are disabled in Settings.');
      return;
    }
    setShowNotifications((previous) => !previous);
  };

  const markAllRead = () => {
    notificationService.markAllRead();
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex">
        <aside className="hidden md:flex w-56 min-h-screen border-r bg-white dark:bg-slate-800 p-4 flex-col">
          <div className="space-y-2">
            <h2 className="font-semibold mb-3">Staffowner</h2>
            <Link className="block" to="/dashboard">Dashboard</Link>
            <Link className="block" to="/profile">View profile</Link>
            <Link className="block" to="/settings">Settings</Link>
            {isOwner && <Link className="block" to="/admin/staff">Staff management</Link>}
            {isOwner && <Link className="block" to="/admin/activity-log">Activity Log</Link>}
            {isOwner && <Link className="block" to="/admin/login-history">Login History</Link>}
          </div>
          <div className="mt-auto border-t pt-3">
            <div className="flex items-center gap-2 mb-3">
              <Image alt={user?.name} src={user?.avatar} className="h-8 w-8 rounded-full object-cover" />
              <div className="text-xs">
                <p className="font-medium">{user?.name}</p>
                <p className="text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button className="w-full rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-2 text-sm" onClick={async () => { await logout(); toast.success('Logged out'); }}>
              Logout
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <header className="h-14 border-b bg-white dark:bg-slate-800 px-4 flex items-center justify-between">
            <CommandBar />
            <div className="flex items-center gap-3 relative">
              <button onClick={() => { document.documentElement.classList.toggle('dark'); }} aria-label="theme-toggle">
                <Sun className="h-4 w-4 inline dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:inline" />
              </button>

              <div className="relative">
                <button className="relative" onClick={openNotifications}>
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-2 text-[10px] bg-indigo-600 text-white rounded-full px-1">{unreadCount}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded border bg-white dark:bg-slate-800 p-2 shadow-lg z-20">
                    <div className="flex items-center justify-between px-1 py-1">
                      <p className="text-sm font-medium">Notifications</p>
                      <button className="text-xs underline" onClick={markAllRead}>Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-auto space-y-1">
                      {notifications.map((item) => (
                        <article key={item.id} className={`rounded border p-2 ${item.read ? 'opacity-70' : ''}`}>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button className="flex items-center gap-1" onClick={() => setShowUserMenu((previous) => !previous)}>
                  <Image alt={user?.name} src={user?.avatar} className="h-8 w-8 rounded-full object-cover" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-44 rounded border bg-white dark:bg-slate-800 shadow-lg z-20 p-1 text-sm">
                    <Link className="block rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700" to="/profile">View profile</Link>
                    <Link className="block rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700" to="/settings">Settings</Link>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="p-4 pb-20 md:pb-4">
            <Outlet />
          </main>
        </section>
      </div>
      <MobileNav isOwner={Boolean(isOwner)} />
    </div>
  );
};
