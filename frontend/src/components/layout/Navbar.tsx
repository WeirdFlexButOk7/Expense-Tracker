import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="text-[var(--color-primary)]" size={28} />
          <span className="text-xl">Finance Tracker</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            {user?.username}
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
