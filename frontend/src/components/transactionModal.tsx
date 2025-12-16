import React, { useEffect, useState } from 'react';
import { Transaction, Category, TransactionRequest } from '../lib/types';
import { actApi } from '../lib/axiosConfig';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

interface TransactionModalProps {
  transaction: Transaction | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionModal({
  transaction,
  categories,
  isOpen,
  onClose,
  onSuccess
}: TransactionModalProps) {
  const [formData, setFormData] = useState<TransactionRequest>({
    categoryName: transaction?.category.name || '',
    name: transaction?.name || '',
    amount: transaction?.amount || 0,
    paymentMode: transaction?.paymentMode || '',
    note: transaction?.note || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      categoryName: transaction?.category.name || '',
      name: transaction?.name || '',
      amount: transaction?.amount || 0,
      paymentMode: transaction?.paymentMode || '',
      note: transaction?.note || ''
    });
  }, [transaction]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName) {
      newErrors.categoryName = 'Category is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.paymentMode.trim()) {
      newErrors.paymentMode = 'Payment mode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (transaction) {
        await actApi.transactions.update(transaction.id, formData);
        toast.success('Transaction updated successfully');
      } else {
        await actApi.transactions.create(formData);
        toast.success('Transaction created successfully');
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) onClose();
        }}
      >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          <DialogDescription>
            {transaction ? 'Update the transaction details below.' : 'Fill in the details to create a new transaction.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.categoryName}
              onChange={(e: { target: { value: string } }) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              disabled={loading}
            >
              <SelectTrigger id="category" className={errors.categoryName ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name} ({category.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryName && (
              <p className="text-sm text-red-600">{errors.categoryName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Grocery Shopping"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              disabled={loading}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode *</Label>
            <Input
              id="paymentMode"
              value={formData.paymentMode}
              onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              placeholder="e.g., Cash, Credit Card"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.paymentMode && (
              <p className="text-sm text-red-600">{errors.paymentMode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={formData.note || ''}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add any additional notes (optional)"
              disabled={loading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : transaction ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
