import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { mockApi, Category } from '../lib/mockApi';
import { toast } from '../lib/toast';
import { Plus, Tag } from 'lucide-react';

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
      const data = await mockApi.categories.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };
  
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1>Categories</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Add Category
        </Button>
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
      
      {isModalOpen && (
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadCategories}
        />
      )}
    </div>
  );
}

interface CategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CategoryModal({ onClose, onSuccess }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await mockApi.categories.create({
        name: formData.name,
        type: formData.type as 'income' | 'expense'
      });
      
      toast.success('Category created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Add Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={loading}
          placeholder="e.g., Groceries, Salary"
        />
        
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
          disabled={loading}
        />
        
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
