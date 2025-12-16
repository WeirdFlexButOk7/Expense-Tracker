import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Loading } from '../components/ui/Loading';
import { mockApi, Transaction, Category } from '../lib/mockApi';
import { toast } from '../lib/toast';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  useEffect(() => {
    loadTransactions();
  }, [searchTerm, filterType, filterCategory, startDate, endDate, currentPage]);
  
  const loadCategories = async () => {
    try {
      const data = await mockApi.categories.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };
  
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { transactions: data, totalPages: pages } = await mockApi.transactions.getAll({
        search: searchTerm,
        type: filterType as 'income' | 'expense' | undefined,
        category: filterCategory,
        startDate,
        endDate,
        page: currentPage,
        limit: 10
      });
      setTransactions(data);
      setTotalPages(pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await mockApi.transactions.delete(id);
      toast.success('Transaction deleted successfully');
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterCategory('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1>Transactions</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add Transaction
        </Button>
      </div>
      
      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' }
                ]}
              />
              
              <Select
                label="Category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(cat => ({ value: cat.name, label: cat.name }))
                ]}
              />
              
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              
              <div className="md:col-span-4">
                <Button variant="ghost" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Transactions List */}
      <Card>
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <Button onClick={() => handleOpenModal()}>Add Your First Transaction</Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p>{transaction.title}</p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{transaction.category}</td>
                      <td className="py-3 px-4">{transaction.date}</td>
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
      
      {/* Add/Edit Modal */}
      {isModalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          categories={categories}
          onClose={handleCloseModal}
          onSuccess={loadTransactions}
        />
      )}
    </div>
  );
}

interface TransactionModalProps {
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

function TransactionModal({ transaction, categories, onClose, onSuccess }: TransactionModalProps) {
  const [formData, setFormData] = useState({
    title: transaction?.title || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || ''
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
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
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
        type: formData.type as 'income' | 'expense'
      };
      
      if (transaction) {
        await mockApi.transactions.update(transaction.id, data);
        toast.success('Transaction updated successfully');
      } else {
        await mockApi.transactions.create(data);
        toast.success('Transaction created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCategories = categories.filter(cat => cat.type === formData.type);
  
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
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
        
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          disabled={loading}
        />
        
        <div>
          <label className="block mb-1.5 text-gray-700">Description (Optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />
        </div>
        
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
