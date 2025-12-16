import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { actApi } from '../lib/axiosConfig';
import { RecurringTransaction, Category } from '../lib/types';
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
      const data = await actApi.categories.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };
  
  const loadRecurringTransactions = async () => {
    try {
      setLoading(true);
      const data = await actApi.recurring.getAll();
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
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recurring transaction?')) return;
    
    try {
      await actApi.recurring.delete(id);
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
                  <th className="text-left py-3 px-4">CategoryName</th>
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
                    <td className="py-3 px-4">{transaction.name}</td>
                    <td className="py-3 px-4">{transaction.categoryName}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{transaction.frequency}</span>
                    </td>
                    <td className="py-3 px-4">{transaction.nextRunDate}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        transaction.categoryType === 'INCOME' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.categoryType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={
                        transaction.categoryType === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }>
                        {transaction.categoryType === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
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
    name: transaction?.name || '',
    amount: transaction?.amount.toString() || '',
    categoryName: transaction?.categoryName || 'EXPENSE',
    categoryType: transaction?.categoryType || '',
    frequency: transaction?.frequency || 'monthly',
    nextRunDate: transaction?.nextRunDate || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Title is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.categoryName) {
      newErrors.categoryName = 'Category is required';
    }
    
    if (!formData.nextRunDate) {
      newErrors.nextRunDate = 'Start date is required';
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
        type: formData.categoryType as 'INCOME' | 'EXPENSE',
        frequency: formData.frequency as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      };
      
      if (transaction) {
        await actApi.recurring.update(transaction.id, data);
        toast.success('Recurring transaction updated successfully');
      } else {
        await actApi.recurring.create(data);
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
  
  const filteredCategories = categories.filter(cat => cat.type === formData.categoryType);
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={transaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
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
          value={formData.categoryType}
          onChange={(e: any) => setFormData({ ...formData, categoryType: e.target.value, categoryName: '' })}
          options={[
            { value: 'INCOME', label: 'Income' },
            { value: 'EXPENSE', label: 'Expense' }
          ]}
          disabled={loading}
        />
        
        <Select
          value={formData.categoryName}
          onChange={(e: any) => setFormData({ ...formData, categoryName: e.target.value })}
          options={[
            ...filteredCategories.map(cat => ({ value: cat.name, label: cat.name }))
          ]}
          error={errors.category}
          disabled={loading}
        />
        
        <Select
          value={formData.frequency}
          onChange={(e: any) => setFormData({ ...formData, frequency: e.target.value })}
          options={[
            { value: 'DAILY', label: 'Daily' },
            { value: 'WEEKLY', label: 'Weekly' },
            { value: 'MONTHLY', label: 'Monthly' },
            { value: 'YEARLY', label: 'Yearly' }
          ]}
          disabled={loading}
        />
        
        <Input
          label="Start Date"
          type="date"
          value={formData.nextRunDate}
          onChange={(e) => setFormData({ ...formData, nextRunDate: e.target.value })}
          error={errors.nextRunDate}
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
