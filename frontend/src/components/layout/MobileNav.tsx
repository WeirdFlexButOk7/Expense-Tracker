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

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-gray-600'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
