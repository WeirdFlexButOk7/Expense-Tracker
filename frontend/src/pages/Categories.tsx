import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { api } from '../lib/axiosConfig';
import { Category } from '../lib/types';
import { Tag } from 'lucide-react';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };
  
  const incomeCategories = categories.filter(cat => cat.type === 'INCOME');
  const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1>Categories</h1>
      </div>
      
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <Card>
            <h3 className="mb-4 text-green-600">Income Categories</h3>
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No income categories</p>
            ) : (
              <div className="space-y-2">
                {incomeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <Tag className="text-green-600" size={20} />
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Expense Categories */}
          <Card>
            <h3 className="mb-4 text-red-600">Expense Categories</h3>
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expense categories</p>
            ) : (
              <div className="space-y-2">
                {expenseCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <Tag className="text-red-600" size={20} />
                    <span className="text-gray-900">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
