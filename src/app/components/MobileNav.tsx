import { Link, useLocation } from 'react-router';
import { LayoutDashboard, ShoppingBag, Package, Coffee, Users } from 'lucide-react';

interface MobileNavProps {
  role: 'owner' | 'staff';
}

export function MobileNav({ role }: MobileNavProps) {
  const location = useLocation();
  const basePath = role === 'owner' ? '/owner' : '/staff';

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Home', path: `${basePath}/dashboard` },
    { icon: <ShoppingBag className="h-5 w-5" />, label: 'Orders', path: `${basePath}/orders` },
    { icon: <Package className="h-5 w-5" />, label: 'Inventory', path: `${basePath}/inventory` },
    { icon: <Coffee className="h-5 w-5" />, label: 'Menu', path: `${basePath}/menu` },
    { icon: <Users className="h-5 w-5" />, label: 'Customers', path: `${basePath}/customers` },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <button
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
