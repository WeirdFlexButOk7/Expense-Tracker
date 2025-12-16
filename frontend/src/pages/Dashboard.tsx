import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { mockApi } from '../lib/mockApi';
import { actApi } from '../lib/axiosConfig';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await mockApi.dashboard.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
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
  
  if (!stats) return null;
  
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Balance</p>
              <h2 className="text-gray-900">${stats.balance.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Income (This Month)</p>
              <h2 className="text-green-600">${stats.income.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Expenses (This Month)</p>
              <h2 className="text-red-600">${stats.expenses.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Category Spending Chart */}
      <Card>
        <h3 className="mb-4">Spending by Category</h3>
        {stats.categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--color-primary)" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No expense data available</p>
        )}
      </Card>
      
      {/* Recent Transactions */}
      <Card>
        <h3 className="mb-4">Recent Transactions</h3>
        {stats.recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTransactions.map((transaction: any) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-gray-900">{transaction.title}</p>
                  <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                </div>
                <p className={`${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        )}
      </Card>
    </div>
  );
}
