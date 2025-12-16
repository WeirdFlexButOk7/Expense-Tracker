import axios from "axios";
import Decimal from "decimal.js";

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let user: actUser| null = null;
export const actApi = {
  auth: {
    login: async (username: string, password: string) => {
      await delay(1000);

    const res = await api.post("/auth/login", {
        username: username,
        password: password
    });
      
      user = {
        username: username
      };
      
      const token = res.data.token;
      console.log(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { userA: user, token };
    },

    register: async (username: string, password: string, confirmPassword: string, balance: Decimal) => {
      await delay(1000);
      
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (username.length < 3) throw new Error("Username must be at least 3 characters");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    console.log(username, password, balance.toString());
    const res = await api.post("/auth/register", {
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
      const userStr = localStorage.getItem('userA');
      if (userStr) {
        user = JSON.parse(userStr);
      }
      return user;
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

export type { actUser };
