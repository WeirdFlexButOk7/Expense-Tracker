import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/axiosConfig';
import { StoreUser } from '../lib/types';
import Decimal from 'decimal.js';

interface AuthContextType {
  user: StoreUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string, balance: Decimal) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const currentUser = api.auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    const { user } = await api.auth.login(username, password);
    setUser(user);
  };
  
  const register = async (username: string, password: string, confirmPassword: string, balance: Decimal) => {
    await api.auth.register(username, password, confirmPassword, balance);
  };
  
  const logout = () => {
    api.auth.logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
