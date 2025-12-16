import axios from "axios";
import Decimal from "decimal.js";
import { StoreUser } from "./types";
import { Transaction, TransactionResponse, TransactionRequest, TransactionFilters, Category, User, RecurringTransaction, RecurringTransactionRequest } from './types';

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let user: StoreUser | null = null;

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      await delay(1000);

    const res = await axiosClient.post("/auth/login", {
        username: username,
        password: password
    });
      
      user = {
        username: username
      };
      
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user: user, token };
    },

    register: async (username: string, password: string, confirmPassword: string, balance: Decimal) => {
      await delay(1000);
      
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (username.length < 3) throw new Error("Username must be at least 3 characters");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    await axiosClient.post("/auth/register", {
        username: username,
        password: password,
        balance: balance.toString()
    });
      
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      user = null;
    },
    
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        user = JSON.parse(userStr);
      }
      return user;
    }
  },

  dashboard: {
    getStats: async (from: string, to: string) => {
      await delay(500);

      const res = await axiosClient.get("/dashboard", {
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

      const resp = await axiosClient.get("/category");
      return resp.data;
    }
  },

  transactions: {
    getAll: async (filters: TransactionFilters): Promise<TransactionResponse> => {
      await delay(500);
      
      const resp = await axiosClient.get("/transaction",{
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

      return resp.data;
    },

    create: async (data: TransactionRequest): Promise<Transaction> => {
      await delay(500);
      
      const resp = await axiosClient.post(`/transaction/new`, data);
      return resp.data;
    },

    update: async (id: number, data: TransactionRequest): Promise<Transaction> => {
      await delay(500);
      
      const resp = await axiosClient.put(`/transaction/update/${id}`, data);
      return resp.data;
    },

    delete: async (id: number): Promise<void> => {
      await delay(300);

      await axiosClient.delete(`/transaction/update/${id}`);
    }
  },

  user: {
    getProfile: async (): Promise<User> => {
      await delay(300);

      const resp = await axiosClient.get("/user");
      return resp.data;
    }
  },

  recurring: {
    getAll: async (): Promise<RecurringTransaction[]> => {
      await delay(300);

      const resp = await axiosClient.get("/recurring");
      const data = resp.data;

      return data.map((item: any): RecurringTransaction => ({
        id: item.id,
        userId: item.user.id,
        categoryName: item.category.name,
        categoryType: item.category.type,
        name: item.name,
        amount: item.amount,
        frequency: item.frequency,
        nextRunDate: item.nextRunDate
      }));
    },

    create: async (data: RecurringTransactionRequest): Promise<RecurringTransaction> => {
      await delay(500);
      
      const resp = await axiosClient.post(`/recurring/new`, data);
      return resp.data;
    },

    update: async (id: number, data: RecurringTransactionRequest): Promise<RecurringTransaction> => {
      await delay(500);
      
      const resp = await axiosClient.put(`/recurring/update/${id}`, data);
      return resp.data;
    },

    delete: async (id: number): Promise<void> => {
      await delay(300);

      await axiosClient.delete(`/recurring/${id}`)
    }
  }

};
