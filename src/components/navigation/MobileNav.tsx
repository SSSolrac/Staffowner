import { NavLink } from 'react-router';

export const MobileNav = ({ isOwner }: { isOwner: boolean }) => (
  <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-[#F3D6DB] bg-white p-2 flex justify-around text-xs">
    <NavLink className={({ isActive }) => `px-2 py-1 rounded-lg ${isActive ? 'bg-[#FFB6C1]' : 'hover:bg-[#FFE4E8]'}`} to="/dashboard">Dashboard</NavLink>
    <NavLink className={({ isActive }) => `px-2 py-1 rounded-lg ${isActive ? 'bg-[#FFB6C1]' : 'hover:bg-[#FFE4E8]'}`} to="/orders">Orders</NavLink>
    <NavLink className={({ isActive }) => `px-2 py-1 rounded-lg ${isActive ? 'bg-[#FFB6C1]' : 'hover:bg-[#FFE4E8]'}`} to="/menu">Menu</NavLink>
    <NavLink className={({ isActive }) => `px-2 py-1 rounded-lg ${isActive ? 'bg-[#FFB6C1]' : 'hover:bg-[#FFE4E8]'}`} to="/customers">Customers</NavLink>
    {isOwner && <NavLink className={({ isActive }) => `px-2 py-1 rounded-lg ${isActive ? 'bg-[#FFB6C1]' : 'hover:bg-[#FFE4E8]'}`} to="/imports">Imports</NavLink>}
  </nav>
);
