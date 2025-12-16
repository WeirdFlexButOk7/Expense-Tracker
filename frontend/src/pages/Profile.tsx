import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { api } from '../lib/axiosConfig';
import { User } from '../lib/types';
import { User as UserIcon, Calendar, DollarSign } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.user.getProfile();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <h1>User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-(--color-primary) bg-opacity-10 rounded-full">
              <UserIcon className="text-(--color-primary)" size={48} />
            </div>
            <div>
              <h2>{user.username}</h2>
              <p className="text-gray-600">User ID: {user.id}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-gray-900">${user.balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{user.username}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Created</p>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
            
          </div>
        </Card>
      </div>
    </div>
  );
}
