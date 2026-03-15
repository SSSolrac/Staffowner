import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Package,
  Coffee,
  Users,
  UserCog,
  History,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronLeft,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { CommandBar } from './CommandBar';
import { MobileNav } from './MobileNav';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface DashboardLayoutProps {
  role: 'owner' | 'staff';
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const ownerNavItems: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/owner/dashboard' },
    { label: 'Orders Overview', icon: <ShoppingBag className="h-5 w-5" />, path: '/owner/orders' },
    { label: 'Sales & Reports', icon: <TrendingUp className="h-5 w-5" />, path: '/owner/reports' },
    { label: 'Inventory Health', icon: <Package className="h-5 w-5" />, path: '/owner/inventory' },
    { label: 'Menu Performance', icon: <Coffee className="h-5 w-5" />, path: '/owner/menu' },
    { label: 'Customers & Loyalty', icon: <Users className="h-5 w-5" />, path: '/owner/customers' },
    { label: 'Staff Management', icon: <UserCog className="h-5 w-5" />, path: '/owner/staff' },
    { label: 'Activity History', icon: <History className="h-5 w-5" />, path: '/owner/activity' },
    { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/owner/settings' },
  ];

  const staffNavItems: NavItem[] = [
    { label: 'Shift Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/staff/dashboard' },
    { label: 'Live Orders Queue', icon: <ShoppingBag className="h-5 w-5" />, path: '/staff/orders' },
    { label: 'Menu & Availability', icon: <Coffee className="h-5 w-5" />, path: '/staff/menu' },
    { label: 'Inventory Updates', icon: <Package className="h-5 w-5" />, path: '/staff/inventory' },
    { label: 'Customers', icon: <Users className="h-5 w-5" />, path: '/staff/customers' },
    { label: 'Activity History', icon: <History className="h-5 w-5" />, path: '/staff/activity' },
    { label: 'My Profile', icon: <User className="h-5 w-5" />, path: '/staff/profile' },
  ];

  const navItems = role === 'owner' ? ownerNavItems : staffNavItems;

  const handleLogout = () => {
    navigate('/');
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/'),
      isLast: index === paths.length - 1,
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile */}
      <aside
        className={`hidden md:flex ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } border-r bg-card transition-all duration-300 flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Happy Tails
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white">
                  {role === 'owner' ? 'OW' : 'ST'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {role === 'owner' ? 'Owner' : 'Staff Member'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {role === 'owner' ? 'Admin' : 'Employee'}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            {/* Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Command Bar */}
            <CommandBar />

            {/* Global search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                style={{ backgroundColor: '#FF4F8B' }}
              >
                3
              </Badge>
            </Button>

            {/* Profile menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {role === 'owner' ? 'OW' : 'ST'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {role === 'owner' ? 'Owner Account' : 'Staff Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}