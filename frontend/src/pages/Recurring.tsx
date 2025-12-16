import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { mockApi, RecurringTransaction, Category } from '../lib/mockApi';
import { toast } from '../lib/toast';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

export function Recurring() {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  
  useEffect(() => {
    loadCategories();
    loadRecurringTransactions();
  }, []);
  
  const loadCategories = async () => {
    try {
      const data = await mockApi.categories.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };
  
  const loadRecurringTransactions = async () => {
    try {
      setLoading(true);
      const data = await mockApi.recurring.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (transaction?: RecurringTransaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring transaction?')) return;
    
    try {
      await mockApi.recurring.delete(id);
      toast.success('Recurring transaction deleted successfully');
      loadRecurringTransactions();
    } catch (err) {
      toast.error('Failed to delete recurring transaction');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1>Recurring Transactions</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add Recurring
        </Button>
      </div>
      
      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No recurring transactions yet</p>
            <Button onClick={() => handleOpenModal()}>Add Your First Recurring Transaction</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Frequency</th>
                  <th className="text-left py-3 px-4">Next Run</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{transaction.title}</td>
                    <td className="py-3 px-4">{transaction.category}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{transaction.frequency}</span>
                    </td>
                    <td className="py-3 px-4">{transaction.nextRun}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(transaction)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {isModalOpen && (
        <RecurringModal
          transaction={editingTransaction}
          categories={categories}
          onClose={handleCloseModal}
          onSuccess={loadRecurringTransactions}
        />
      )}
    </div>
  );
}

interface RecurringModalProps {
  transaction: RecurringTransaction | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

function RecurringModal({ transaction, categories, onClose, onSuccess }: RecurringModalProps) {
  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    frequency: transaction?.frequency || 'monthly',
    startDate: transaction?.startDate || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        type: formData.type as 'income' | 'expense',
        frequency: formData.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly'
      };
      
      if (transaction) {
        await mockApi.recurring.update(transaction.id, data);
        toast.success('Recurring transaction updated successfully');
      } else {
        await mockApi.recurring.create(data);
        toast.success('Recurring transaction created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to save recurring transaction');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCategories = categories.filter(cat => cat.type === formData.type);
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={transaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          disabled={loading}
        />
        
        <Input
          label="Amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          disabled={loading}
        />
        
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' }
          ]}
          disabled={loading}
        />
        
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            { value: '', label: 'Select a category' },
            ...filteredCategories.map(cat => ({ value: cat.name, label: cat.name }))
          ]}
          error={errors.category}
          disabled={loading}
        />
        
        <Select
          label="Frequency"
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' }
          ]}
          disabled={loading}
        />
        
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          error={errors.startDate}
          disabled={loading}
        />
        
        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : transaction ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
