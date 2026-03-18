import { Navigate, createBrowserRouter } from 'react-router';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { LoginPage } from '@/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ActivityLogPage } from '@/pages/admin/ActivityLogPage';
import { LoginHistoryPage } from '@/pages/admin/LoginHistoryPage';
import { StaffManagementPage } from '@/pages/admin/StaffManagementPage';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ ownerOnly = false, children }: { ownerOnly?: boolean; children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (ownerOnly && user.role !== 'owner') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'admin/activity-log', element: <ProtectedRoute ownerOnly><ActivityLogPage /></ProtectedRoute> },
      { path: 'admin/login-history', element: <ProtectedRoute ownerOnly><LoginHistoryPage /></ProtectedRoute> },
      { path: 'admin/staff', element: <ProtectedRoute ownerOnly><StaffManagementPage /></ProtectedRoute> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
