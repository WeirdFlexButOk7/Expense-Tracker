import React, { createContext, useContext, useState, useEffect } from 'react';
import { actApi,  actUser } from '../lib/axiosConfig';
import Decimal from 'decimal.js';

interface AuthContextType {
  userA: actUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string, balance: Decimal) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userA, setUserA] = useState<actUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const currentUser = actApi.auth.getCurrentUser();
    setUserA(currentUser);
    setLoading(false);
  }, []);
  
  const login = async (username: string, password: string) => {
    const { userA } = await actApi.auth.login(username, password);
    setUserA(userA);
  };
  
  const register = async (username: string, password: string, confirmPassword: string, balance: Decimal) => {
    await actApi.auth.register(username, password, confirmPassword, balance);
  };
  
  const logout = () => {
    actApi.auth.logout();
    setUserA(null);
  };
  
  return (
    <AuthContext.Provider value={{ userA, loading, login, register, logout }}>
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
