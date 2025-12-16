import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, RefreshCw, User, Tag } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: Receipt, label: 'Transactions' },
  { to: '/recurring', icon: RefreshCw, label: 'Recurring' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
