import { Bell, LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { CommandBar } from '@/components/navigation/CommandBar';
import { MobileNav } from '@/components/navigation/MobileNav';

const navBaseClass = 'block rounded-xl px-3 py-2 text-sm font-medium text-[#1F2937] transition-colors hover:bg-[#FFE4E8]';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.role === 'owner';

  const onSignOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await logout();
    toast.success('Signed out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFF7F9] text-[#1F2937]">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen border-r border-[#F3D6DB] bg-white p-4 flex-col">
          <div className="space-y-2">
            <h2 className="font-semibold mb-3">Staffowner</h2>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/dashboard">Dashboard</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/orders">Orders</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/daily-menu">Daily Menu</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/menu">Menu</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/customers">Customers / Loyalty</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/imports">Imports / Reports</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/settings">Settings</NavLink>
            <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/profile">Profile</NavLink>
            {isOwner && <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/admin/activity-log">Admin Logs</NavLink>}
            {isOwner && <NavLink className={({ isActive }) => `${navBaseClass} ${isActive ? 'bg-[#FFB6C1]' : ''}`} to="/admin/login-history">Login History</NavLink>}
          </div>

          <div className="mt-auto pt-4 border-t border-[#F3D6DB]">
            <button
              onClick={onSignOut}
              className="w-full rounded-xl px-3 py-2 text-sm font-medium text-[#1F2937] flex items-center gap-2 hover:bg-[#FFE4E8] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>
        <section className="flex-1">
          <header className="h-14 border-b border-[#F3D6DB] bg-white px-4 flex items-center justify-between">
            <CommandBar />
            <button onClick={() => toast.info('Open Dashboard > Overview for current operational alerts.')} aria-label="open-alerts" className="rounded-xl p-2 hover:bg-[#FFE4E8] transition-colors">
              <Bell className="h-4 w-4" />
            </button>
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
