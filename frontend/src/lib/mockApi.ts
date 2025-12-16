// Mock API for demonstration purposes
// Replace with real API calls when backend is available

interface User {
  id: string;
  username: string;
  createdAt: string;
  balance: number;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  nextRun: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

// Simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockUser: User | null = null;
let mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: '2025-12-01',
    description: 'Monthly salary'
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    amount: 250,
    type: 'expense',
    category: 'Groceries',
    date: '2025-12-05',
    description: 'Weekly groceries'
  },
  {
    id: '3',
    title: 'Electric Bill',
    amount: 120,
    type: 'expense',
    category: 'Utilities',
    date: '2025-12-10',
    description: 'Monthly electric bill'
  },
  {
    id: '4',
    title: 'Freelance Project',
    amount: 1500,
    type: 'income',
    category: 'Freelance',
    date: '2025-12-12',
    description: 'Website development'
  },
  {
    id: '5',
    title: 'Dining Out',
    amount: 80,
    type: 'expense',
    category: 'Food',
    date: '2025-12-14',
    description: 'Dinner with friends'
  }
];

let mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: '1',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    frequency: 'monthly',
    startDate: '2025-01-01',
    nextRun: '2026-01-01'
  },
  {
    id: '2',
    title: 'Rent',
    amount: 1200,
    type: 'expense',
    category: 'Housing',
    frequency: 'monthly',
    startDate: '2025-01-01',
    nextRun: '2026-01-01'
  }
];

let mockCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Freelance', type: 'income' },
  { id: '3', name: 'Investment', type: 'income' },
  { id: '4', name: 'Groceries', type: 'expense' },
  { id: '5', name: 'Utilities', type: 'expense' },
  { id: '6', name: 'Food', type: 'expense' },
  { id: '7', name: 'Entertainment', type: 'expense' },
  { id: '8', name: 'Housing', type: 'expense' },
  { id: '9', name: 'Transportation', type: 'expense' }
];

export const mockApi = {
  auth: {
    login: async (username: string, password: string) => {
      await delay(1000);
      
      if (password === 'wrong') {
        throw new Error('Invalid credentials');
      }
      
      mockUser = {
        id: '1',
        username,
        createdAt: '2024-01-01',
        balance: 5000
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser, token };
    },
    
    register: async (username: string, password: string, confirmPassword: string) => {
      await delay(1000);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      mockUser = {
        id: '1',
        username,
        createdAt: new Date().toISOString(),
        balance: 0
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser, token };
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      mockUser = null;
    },
    
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        mockUser = JSON.parse(userStr);
      }
      return mockUser;
    }
  },
  
  user: {
    getProfile: async () => {
      await delay(500);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      return JSON.parse(userStr);
    }
  },
  
  transactions: {
    getAll: async (filters?: { 
      startDate?: string; 
      endDate?: string; 
      category?: string; 
      type?: 'income' | 'expense';
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      await delay(500);
      
      let filtered = [...mockTransactions];
      
      if (filters?.startDate) {
        filtered = filtered.filter(t => t.date >= filters.startDate!);
      }
      
      if (filters?.endDate) {
        filtered = filtered.filter(t => t.date <= filters.endDate!);
      }
      
      if (filters?.category) {
        filtered = filtered.filter(t => t.category === filters.category);
      }
      
      if (filters?.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by date descending
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        transactions: filtered.slice(start, end),
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit)
      };
    },
    
    getById: async (id: string) => {
      await delay(300);
      const transaction = mockTransactions.find(t => t.id === id);
      if (!transaction) throw new Error('Transaction not found');
      return transaction;
    },
    
    create: async (data: Omit<Transaction, 'id'>) => {
      await delay(500);
      const newTransaction: Transaction = {
        ...data,
        id: Date.now().toString()
      };
      mockTransactions.push(newTransaction);
      return newTransaction;
    },
    
    update: async (id: string, data: Partial<Transaction>) => {
      await delay(500);
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Transaction not found');
      
      mockTransactions[index] = { ...mockTransactions[index], ...data };
      return mockTransactions[index];
    },
    
    delete: async (id: string) => {
      await delay(500);
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Transaction not found');
      
      mockTransactions.splice(index, 1);
      return { success: true };
    }
  },
  
  recurring: {
    getAll: async () => {
      await delay(500);
      return mockRecurringTransactions;
    },
    
    create: async (data: Omit<RecurringTransaction, 'id' | 'nextRun'>) => {
      await delay(500);
      const newRecurring: RecurringTransaction = {
        ...data,
        id: Date.now().toString(),
        nextRun: data.startDate
      };
      mockRecurringTransactions.push(newRecurring);
      return newRecurring;
    },
    
    update: async (id: string, data: Partial<RecurringTransaction>) => {
      await delay(500);
      const index = mockRecurringTransactions.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Recurring transaction not found');
      
      mockRecurringTransactions[index] = { ...mockRecurringTransactions[index], ...data };
      return mockRecurringTransactions[index];
    },
    
    delete: async (id: string) => {
      await delay(500);
      const index = mockRecurringTransactions.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Recurring transaction not found');
      
      mockRecurringTransactions.splice(index, 1);
      return { success: true };
    }
  },
  
  categories: {
    getAll: async () => {
      await delay(300);
      return mockCategories;
    },
    
    create: async (data: Omit<Category, 'id'>) => {
      await delay(500);
      const newCategory: Category = {
        ...data,
        id: Date.now().toString()
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
  },
  
  dashboard: {
    getStats: async () => {
      await delay(500);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthTransactions = mockTransactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
      
      const income = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = income - expenses;
      
      // Category-wise spending
      const categorySpending: Record<string, number> = {};
      currentMonthTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        });
      
      const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
        name,
        value
      }));
      
      // Recent transactions
      const recent = [...mockTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      return {
        balance,
        income,
        expenses,
        categoryData,
        recentTransactions: recent
      };
    }
  }
};

export type { User, Transaction, RecurringTransaction, Category };
