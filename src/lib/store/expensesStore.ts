import axios from "axios";
import { create } from "zustand";

interface Expenses {
  expenses: [
    {
      id: string;
      userId: string;
      categoryId: string;
      amount: number;
      isOverLimit: boolean;
      description: string;
      createdAt: string;
      updatedAt: string;
      category: {
        name: string;
        limit: number;
      };
      totalSpent: number;
    }
  ];
}

interface ExpensesState {
  expenses: Expenses | null;
  expensesLoading: boolean;
  expensesError: string | null;
  fetchExpenses: () => Promise<void>;
  updateExpenses: (updatedData: Partial<Expenses>) => Promise<boolean>;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  expenses: null,
  expensesLoading: false,
  expensesError: null,

  fetchExpenses: async () => {
    set({expensesLoading: true, expensesError: null});

    try {
        const response = await axios.get("api/expenses");
        set({expenses: response.data, expensesLoading: false})
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        set({
            expensesError: error.response?.data?.message || "Failed to load expenses",
            expensesLoading: false
        })
    }
  }
}));
