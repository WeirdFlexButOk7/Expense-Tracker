export interface User {
  id: string;
  username: string;
  createdAt: string;
  balance: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Transaction {
  id: number;
  user: User;
  category: Category;
  name: string;
  amount: number;
  datetime: string;
  paymentMode: string;
  note?: string;
}

export interface TransactionResponse {
  username: string;
  transactionsCount: number;
  totalIncome: number;
  totalExpense: number;
  totalDelta: number;
  transactions: Transaction[];
}

export interface TransactionRequest {
  categoryName: string;
  name: string;
  amount: number;
  paymentMode: string;
  note?: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  categoryType?: string;
  categoryName?: string;
  name?: string;
  paymentMode?: string;
  note?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface RecurringTransaction {
  id: number;
  userId: number;
  categoryName: string;
  categoryType: string;
  name: string;
  amount: number;
  frequency: string;
  nextRunDate: string;
}

export interface RecurringTransactionRequest {
  categoryName: string;
  name: string;
  amount: string;
  frequency: string;
  nextRunDate: string;
}
