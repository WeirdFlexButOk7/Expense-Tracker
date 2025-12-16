import React, { useState, useEffect } from 'react';
import { Transaction, Category, TransactionFilters, TransactionResponse } from '../lib/types';
import { actApi } from '../lib/axiosConfig';
import { TransactionModal } from '../components/transactionModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Edit2, Trash2, Search, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

export function Transactions() {
  const [transactionResponse, setTransactionResponse] = useState<TransactionResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<TransactionFilters>({
    from: '',
    to: '',
    categoryType: 'ALL',
    categoryName: 'ALL',
    name: '',
    paymentMode: '',
    note: '',
    minAmount: undefined,
    maxAmount: undefined
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const data = await actApi.categories.getAll();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
      console.error(err);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await actApi.transactions.getAll(filters);
      setTransactionResponse(data);
    } catch (err) {
      toast.error('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (transaction?: Transaction) => {
    console.log(transaction);
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await actApi.transactions.delete(id);
      toast.success('Transaction deleted successfully');
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const resetFilters = () => {
    setFilters({
      from: '',
      to: '',
      categoryType: 'ALL',
      categoryName: 'ALL',
      name: '',
      paymentMode: '',
      note: '',
      minAmount: undefined,
      maxAmount: undefined
    });
  };

  const updateFilter = <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl">Transactions</h1>
          {transactionResponse && (
            <p className="text-gray-600 mt-1">
              Showing {transactionResponse.transactionsCount} transaction(s) for {transactionResponse.username}
            </p>
          )}
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      {transactionResponse && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-green-600">{formatCurrency(transactionResponse.totalIncome)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-red-600">{formatCurrency(transactionResponse.totalExpense)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl ${transactionResponse.totalDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(transactionResponse.totalDelta)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">{transactionResponse.transactionsCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Search & Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by transaction name..."
                value={filters.name}
                onChange={(e) => updateFilter('name', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="space-y-4 pt-4 border-t">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From Date</Label>
                    <Input
                      id="from"
                      type="date"
                      value={filters.from}
                      onChange={(e) => updateFilter('from', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To Date</Label>
                    <Input
                      id="to"
                      type="date"
                      value={filters.to}
                      onChange={(e) => updateFilter('to', e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryType">Category Type</Label>
                    <Select
                      value={filters.categoryType}
                      onChange={(e) => updateFilter('categoryType', e.target.value)}
                    >
                      <SelectTrigger id="categoryType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Select
                      value={filters.categoryName}
                      onChange={(e) => updateFilter('categoryType', e.target.value)}
                    >
                      <SelectTrigger id="categoryName">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Mode and Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Input
                      id="paymentMode"
                      placeholder="e.g., Cash, Credit Card"
                      value={filters.paymentMode}
                      onChange={(e) => updateFilter('paymentMode', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Input
                      id="note"
                      placeholder="Search in notes..."
                      value={filters.note}
                      onChange={(e) => updateFilter('note', e.target.value)}
                    />
                  </div>
                </div>

                {/* Amount Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Minimum Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={filters.minAmount || ''}
                      onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Maximum Amount</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={filters.maxAmount || ''}
                      onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                    <X size={16} />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            </div>
          ) : !transactionResponse || transactionResponse.transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No transactions found</p>
              <Button onClick={() => handleOpenModal()}>Add Your First Transaction</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionResponse.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{transaction.category.name}</span>
                          <Badge
                            variant={transaction.category.type === 'INCOME' ? 'default' : 'secondary'}
                            className={
                              transaction.category.type === 'INCOME'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 w-fit'
                                : 'bg-red-100 text-red-800 hover:bg-red-200 w-fit'
                            }
                          >
                            {transaction.category.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(transaction.datetime)}
                      </TableCell>
                      <TableCell>{transaction.paymentMode}</TableCell>
                      <TableCell className="max-w-50">
                        <span className="text-sm text-gray-600 truncate block">
                          {transaction.note || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.category.type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {transaction.category.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(transaction)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal
        transaction={editingTransaction}
        categories={categories}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={loadTransactions}
      />
    </div>
  );
}
