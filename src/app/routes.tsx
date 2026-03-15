import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { MenuPage } from './pages/MenuPage';
import { CustomersPage } from './pages/CustomersPage';
import { StaffManagementPage } from './pages/StaffManagementPage';
import { ActivityHistoryPage } from './pages/ActivityHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { SalesReportsPage } from './pages/SalesReportsPage';
import { DashboardLayout } from './components/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/owner',
    element: <DashboardLayout role="owner" />,
    children: [
      {
        index: true,
        element: <Navigate to="/owner/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <OwnerDashboard />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'reports',
        element: <SalesReportsPage />, // New route for sales reports
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'menu',
        element: <MenuPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'staff',
        element: <StaffManagementPage />,
      },
      {
        path: 'activity',
        element: <ActivityHistoryPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/staff',
    element: <DashboardLayout role="staff" />,
    children: [
      {
        index: true,
        element: <Navigate to="/staff/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <StaffDashboard />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'menu',
        element: <MenuPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'activity',
        element: <ActivityHistoryPage />,
      },
      {
        path: 'profile',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);