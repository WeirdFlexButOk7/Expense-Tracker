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
  }

};

export type { actUser };
