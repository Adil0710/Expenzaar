import axios from "axios";
import { create } from "zustand";

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  isOverLimit?: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    name: string;
    limit: number;
  };
  totalSpent?: number;
}

interface ExpensesState {
  expenses: Expense[] | null;
  expensesLoading: boolean;
  expensesError: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (addedData: Partial<Expense>) => Promise<boolean>;
  updateExpense: (updatedData: Partial<Expense>, expenseId: string) => Promise<boolean>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: null,
  expensesLoading: false,
  expensesError: null,

  fetchExpenses: async () => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.get("/api/expenses");
      set({ expenses: response.data.expenses, expensesLoading: false });
    } catch (error: any) {
      set({
        expensesError: error.response?.data?.message || "Failed to load expenses",
        expensesLoading: false,
      });
    }
  },

  addExpense: async (addedData) => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.post("/api/expenses/add", addedData);
      if (response.data.success) {
        set((state) => ({
          expenses: state.expenses ? [...state.expenses, response.data.expense] : [response.data.expense],
          expensesLoading: false,
        }));
        return true;
      }
      throw new Error(response.data.message);
    } catch (error: any) {
      set({
        expensesError: error.response?.data?.message || "Failed to add expense",
        expensesLoading: false,
      });
      return false;
    }
  },

  updateExpense: async (updatedData, expenseId) => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.put(`/api/expenses/update/${expenseId}`, updatedData);
      if (response.data.success) {
        set((state) => ({
          expenses: state.expenses
            ? state.expenses.map((expense) =>
                expense.id === expenseId ? { ...expense, ...updatedData } : expense
              )
            : null,
          expensesLoading: false,
        }));
        return true;
      }
      throw new Error(response.data.message);
    } catch (error: any) {
      set({
        expensesError: error.response?.data?.message || "Failed to update expense",
        expensesLoading: false,
      });
      return false;
    }
  },

  deleteExpense: async (expenseId) => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.delete(`/api/expenses/delete/${expenseId}`);
      if (response.data.success) {
        set((state) => ({
          expenses: state.expenses ? state.expenses.filter((expense) => expense.id !== expenseId) : null,
          expensesLoading: false,
        }));
        return true;
      }
      throw new Error(response.data.message);
    } catch (error: any) {
      set({
        expensesError: error.response?.data?.message || "Failed to delete expense",
        expensesLoading: false,
      });
      return false;
    }
  },
}));
