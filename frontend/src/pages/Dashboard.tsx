import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { actApi } from '../lib/axiosConfig';
import { TrendingUp, TrendingDown, DollarSign, List } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = (
  {active, payload, label}: {active?: boolean; payload?: any[]; label?: string;}) => {
  if (!active || !payload || payload.length === 0) return null;

  const { value, transactionCount } = payload[0].payload;

  return (
    <div className="bg-white p-2 border rounded shadow text-sm">
      <p className="font-medium">{label}</p>
      <p>Amount: ${value}</p>
      <p>Transactions: {transactionCount}</p>
    </div>
  );
};

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const [from, setFrom] = useState<any>(null);
  const [to, setTo] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await actApi.dashboard.getStats(from, to);
      setStats(data);
      setFrom(data.fromDate);
      setTo(data.toDate);
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          <button
            onClick={loadStats}
            className="bg-blue-600 text-white px-4 py-2 rounded h-9.5"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Balance</p>
              <h2 className="text-gray-900">${stats.balance.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="text-blue-600" size={18} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Income</p>
              <h2 className="text-green-600">${stats.totalIncome.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={18} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Expenses</p>
              <h2 className="text-red-600">${stats.totalExpense.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="text-red-600" size={18} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Transactions Count</p>
              <h2 className="text-gray-600">{stats.transactionsCount}</h2>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <List className="text-gray-600" size={18} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Category Spending Chart */}
      <Card>
        <h3 className="mb-4">Spending by Category</h3>
        {stats.expenseBreakdown.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.expenseBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" fill="var(--color-primary)" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No expense data available</p>
        )}
      </Card>
    </div>
  );
}
