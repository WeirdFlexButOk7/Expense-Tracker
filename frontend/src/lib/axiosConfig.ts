import axios from "axios";
import Decimal from "decimal.js";
import { Transaction, TransactionResponse, TransactionRequest, TransactionFilters, Category } from './types';

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface actUser {
  username: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'Salary', type: 'INCOME' },
  { id: 2, name: 'Freelance', type: 'INCOME' },
  { id: 3, name: 'Investment', type: 'INCOME' },
  { id: 4, name: 'Food', type: 'EXPENSE' },
  { id: 5, name: 'Transport', type: 'EXPENSE' },
  { id: 6, name: 'Entertainment', type: 'EXPENSE' },
  { id: 7, name: 'Shopping', type: 'EXPENSE' },
  { id: 8, name: 'Bills', type: 'EXPENSE' },
  { id: 9, name: 'Healthcare', type: 'EXPENSE' },
];

const mockUser = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com'
};

let mockTransactions: Transaction[] = [
  {
    id: 1,
    user: mockUser,
    category: mockCategories[0],
    name: 'Monthly Salary',
    amount: 5000,
    datetime: '2024-01-15T10:00:00',
    paymentMode: 'Bank Transfer',
    note: 'January salary'
  },
  {
    id: 2,
    user: mockUser,
    category: mockCategories[3],
    name: 'Grocery Shopping',
    amount: 150.50,
    datetime: '2024-01-16T14:30:00',
    paymentMode: 'Credit Card',
    note: 'Weekly groceries'
  },
  {
    id: 3,
    user: mockUser,
    category: mockCategories[4],
    name: 'Gas Station',
    amount: 45.00,
    datetime: '2024-01-17T08:15:00',
    paymentMode: 'Cash',
    note: 'Fuel for car'
  },
  {
    id: 4,
    user: mockUser,
    category: mockCategories[1],
    name: 'Web Design Project',
    amount: 1200,
    datetime: '2024-01-18T16:45:00',
    paymentMode: 'PayPal',
    note: 'Client payment for website redesign'
  },
  {
    id: 5,
    user: mockUser,
    category: mockCategories[5],
    name: 'Movie Tickets',
    amount: 30.00,
    datetime: '2024-01-19T19:00:00',
    paymentMode: 'Debit Card',
    note: 'Weekend entertainment'
  }
];


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let userA: actUser| null = null;
export const actApi = {
  auth: {
    login: async (username: string, password: string) => {
      await delay(1000);

    const res = await api.post("/auth/login", {
        username: username,
        password: password
    });
      
      userA = {
        username: username
      };
      
      const token = res.data.token;
      console.log(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userA', JSON.stringify(userA));
      
      return { userA: userA, token };
    },

    register: async (username: string, password: string, confirmPassword: string, balance: Decimal) => {
      await delay(1000);
      
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (username.length < 3) throw new Error("Username must be at least 3 characters");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    await api.post("/auth/register", {
        username: username,
        password: password,
        balance: balance.toString()
    });
      
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userA');
      userA = null;
    },
    
    getCurrentUser: () => {
      const userStr = localStorage.getItem('userA');
      if (userStr) {
        userA = JSON.parse(userStr);
      }
      return userA;
    }
  },

  dashboard: {
    getStats: async (from: string, to: string) => {
      await delay(500);

      const res = await api.get("/dashboard", {
        params: { from, to }
      });

      const categoryData = res.data.expenseBreakdown.map(
        (item: { category: string; totalAmount: number; transactionCount: number }) => ({
          name: item.category,
          value: item.totalAmount,
          transactionCount: item.transactionCount
        })
      );

      res.data.expenseBreakdown = categoryData;

      return res.data;
    }
  },

  categories: {
    getAll: async (): Promise<Category[]> => {
      await delay(300);

      const resp = await api.get("/category");
      return resp.data;
    }
  },

  transactions: {
    getAll: async (filters: TransactionFilters): Promise<TransactionResponse> => {
      await delay(500);
      
      const resp = await api.get("/transaction",{
        params: {
          from: filters.from,
          to: filters.to,
          categoryType: filters.categoryType,
          categoryName: filters.categoryName,
          name : filters.name,
          paymentMode: filters.paymentMode,
          note: filters.note,
          minAmount: filters.minAmount,
          maxAmount: filters.maxAmount
        }
      });

      console.log(resp)
      return resp.data;
    },

    create: async (data: TransactionRequest): Promise<Transaction> => {
      await delay(500);
      
      const resp = await api.post(`/transactions/new`, data);
      return resp.data;
    },

    update: async (id: number, data: TransactionRequest): Promise<Transaction> => {
      await delay(500);
      
      const resp = await api.put(`/transactions/update/${id}`, data);
      return resp.data;
    },

    delete: async (id: number): Promise<void> => {
      await delay(300);

      await api.delete(`/transactions/update/${id}`);
    }
  }
};

export type { actUser };
