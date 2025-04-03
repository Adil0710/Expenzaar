import axios from "axios";
import { create } from "zustand";

export interface Expense {
  id: string;
  userId: string;
  expenseId: string;
  amount: number;
  isOverLimit?: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    name: string;
    limit: number;
    color: string;
    icon: string;
    id: string;
  };
  totalSpent?: number;
}

export interface Expenses {
  expenses: Expense[];
}

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface FilterOptions {
  dateRange: DateRange;
  categoryId: string | null;
  searchTerm: string;
}

interface ExpensesState {
  expenses: Expense[] | null;
  expensesLoading: boolean;
  expensesError: string | null;
  // Pagination state
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  // All Expenses (for client-side pagination)
  allExpenses: Expense[];
  // Filter state
  filters: FilterOptions;
  // Filter methods
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
  // Pagination methods
  setPageSize: (size: number) => void;
  setPage: (page: number) => void;
  getPaginatedExpenses: () => Expense[];
  // Get filtered Expenses
  getFilteredExpenses: () => Expense[];
  // CRUD operations
  fetchExpenses: () => Promise<void>;
  addExpense: (addedData: Partial<Expense>) => Promise<boolean>;
  updateExpense: (
    updatedData: Partial<Expense>,
    expenseId: string
  ) => Promise<boolean>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  expenses: null,
  expensesLoading: false,
  expensesError: null,
  allExpenses: [],
  filters: {
    dateRange: {
      startDate: null,
      endDate: null,
    },
    categoryId: null,
    searchTerm: "",
  },
  pagination: {
    page: 1,
    pageSize: 8, // Default page size
    totalPages: 1,
  },

  // Set date range filter
  setDateRange: (startDate, endDate) => {
    set((state) => ({
      filters: {
        ...state.filters,
        dateRange: { startDate, endDate },
      },
    }));

    // Update pagination and displayed expenses
    const filteredExpenses = get().getFilteredExpenses();
    const totalPages = Math.ceil(
      filteredExpenses.length / get().pagination.pageSize
    );

    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1, // Reset to first page when filtering
        totalPages,
      },
    }));

    // Update displayed expenses
    get().setPage(1);
  },

  // Add additional debugging for category filtering
  setCategoryFilter: (categoryId) => {
    console.log("Setting category filter to:", categoryId);

    set((state) => ({
      filters: {
        ...state.filters,
        categoryId,
      },
    }));

    // Update pagination and displayed expenses
    const filteredExpenses = get().getFilteredExpenses();
    console.log(`After filtering, found ${filteredExpenses.length} expenses`);

    // Log the first few expenses and their categories for debugging
    if (filteredExpenses.length > 0) {
      console.log(
        "Sample filtered expenses:",
        filteredExpenses.slice(0, 3).map((e) => ({
          id: e.id,
          categoryId: e.category?.id,
          categoryName: e.category?.name,
        }))
      );
    }

    const totalPages = Math.ceil(
      filteredExpenses.length / get().pagination.pageSize
    );

    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1, // Reset to first page when filtering
        totalPages,
      },
    }));

    // Update displayed expenses
    get().setPage(1);
  },

  // Set search term
  setSearchTerm: (term) => {
    set((state) => ({
      filters: {
        ...state.filters,
        searchTerm: term,
      },
    }));

    // Update pagination and displayed expenses
    const filteredExpenses = get().getFilteredExpenses();
    const totalPages = Math.ceil(
      filteredExpenses.length / get().pagination.pageSize
    );

    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1, // Reset to first page when filtering
        totalPages,
      },
    }));

    // Update displayed expenses
    get().setPage(1);
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        dateRange: {
          startDate: null,
          endDate: null,
        },
        categoryId: null,
        searchTerm: "",
      },
    });

    // Update pagination and displayed expenses
    const allExpenses = get().allExpenses;
    const totalPages = Math.ceil(
      allExpenses.length / get().pagination.pageSize
    );

    set((state) => ({
      pagination: {
        ...state.pagination,
        page: 1,
        totalPages,
      },
    }));

    // Update displayed expenses
    get().setPage(1);
  },

  // Get filtered expenses based on all filters
  getFilteredExpenses: () => {
    const { allExpenses, filters } = get();

    return allExpenses.filter((expense) => {
      // Filter by date range
      if (filters.dateRange.startDate || filters.dateRange.endDate) {
        const expenseDate = new Date(expense.createdAt || "");

        if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          if (expenseDate < startDate) return false;
        }

        if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          // Set end date to end of day
          endDate.setHours(23, 59, 59, 999);
          if (expenseDate > endDate) return false;
        }
      }

      // Filter by category - improved comparison
      if (filters.categoryId) {
        // Check if category exists and if IDs match (convert to string for safer comparison)
        if (
          !expense.category ||
          String(expense.category.id) !== String(filters.categoryId)
        ) {
          return false;
        }
      }

      // Filter by search term (description or category name)
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesDescription = (expense.description || "")
          .toLowerCase()
          .includes(searchTerm);
        const matchesCategoryName = (expense.category?.name || "")
          .toLowerCase()
          .includes(searchTerm);

        if (!matchesDescription && !matchesCategoryName) {
          return false;
        }
      }

      return true;
    });
  },

  // Set page size and recalculate total pages
  setPageSize: (size) => {
    const filteredExpenses = get().getFilteredExpenses();
    const totalPages = Math.ceil(filteredExpenses.length / size);

    set((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: size,
        page: 1, // Reset to first page when changing page size
        totalPages,
      },
    }));

    // Update displayed expenses
    get().setPage(1);
  },

  // Set current page
  setPage: (page) => {
    const { pageSize } = get().pagination;
    const filteredExpenses = get().getFilteredExpenses();

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
      // Update the paginated view with the correct slice
      expenses: paginatedExpenses,
    }));
  },

  // Get current page of expenses
  getPaginatedExpenses: () => {
    const { page, pageSize } = get().pagination;
    const filteredExpenses = get().getFilteredExpenses();

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredExpenses.slice(startIndex, endIndex);
  },

  fetchExpenses: async () => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.get("/api/expenses");
      const allExpenses = response.data.expenses;

      // Calculate total pages based on filtered expenses
      const filteredExpenses = allExpenses.filter((expense: Expense) => {
        // Apply initial filters if any
        const { filters } = get();

        // Filter by date range
        if (filters.dateRange.startDate || filters.dateRange.endDate) {
          const expenseDate = new Date(expense.createdAt || "");

          if (filters.dateRange.startDate) {
            const startDate = new Date(filters.dateRange.startDate);
            if (expenseDate < startDate) return false;
          }

          if (filters.dateRange.endDate) {
            const endDate = new Date(filters.dateRange.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (expenseDate > endDate) return false;
          }
        }

        // Filter by category - improved comparison
        if (filters.categoryId) {
          // Check if category exists and if IDs match (convert to string for safer comparison)
          if (
            !expense.category ||
            String(expense.category.id) !== String(filters.categoryId)
          ) {
            return false;
          }
        }

        // Filter by search term
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          const matchesDescription = (expense.description || "")
            .toLowerCase()
            .includes(searchTerm);
          const matchesCategoryName = (expense.category?.name || "")
            .toLowerCase()
            .includes(searchTerm);

          if (!matchesDescription && !matchesCategoryName) {
            return false;
          }
        }

        return true;
      });

      // Calculate pagination
      const { pageSize } = get().pagination;
      const totalPages = Math.ceil(filteredExpenses.length / pageSize);

      // Get current page of expenses
      const currentPage = get().pagination.page;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

      set({
        allExpenses,
        expenses: paginatedExpenses,
        expensesLoading: false,
        pagination: {
          ...get().pagination,
          totalPages,
          // Reset to page 1 if current page is beyond total pages
          page: currentPage > totalPages && totalPages > 0 ? 1 : currentPage,
        },
      });

      // If we reset to page 1, update the paginated view
      if (currentPage > totalPages && totalPages > 0) {
        get().setPage(1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        expensesError:
          error.response?.data?.message || "Failed to load expenses",
        expensesLoading: false,
      });
    }
  },

  addExpense: async (addedData) => {
    set({ expensesLoading: true, expensesError: null });

    try {
      const response = await axios.post("/api/expenses/add", addedData);
      if (response.data.success) {
        // Add to all expenses
        const newExpense = response.data.expense;
        const updatedAllExpenses = [newExpense, ...get().allExpenses];

        // Recalculate pagination based on filtered expenses
        const filteredExpenses = [...updatedAllExpenses].filter((expense) => {
          // Apply current filters
          const { filters } = get();

          // Filter by date range
          if (filters.dateRange.startDate || filters.dateRange.endDate) {
            const expenseDate = new Date(expense.createdAt || "");

            if (filters.dateRange.startDate) {
              const startDate = new Date(filters.dateRange.startDate);
              if (expenseDate < startDate) return false;
            }

            if (filters.dateRange.endDate) {
              const endDate = new Date(filters.dateRange.endDate);
              endDate.setHours(23, 59, 59, 999);
              if (expenseDate > endDate) return false;
            }
          }

          // Filter by category
          if (
            filters.categoryId &&
            expense.category?.id !== filters.categoryId
          ) {
            return false;
          }

          // Filter by search term
          if (filters.searchTerm) {
            const searchTerm = filters.searchTerm.toLowerCase();
            const matchesDescription = expense.description
              .toLowerCase()
              .includes(searchTerm);
            const matchesCategoryName = expense.category?.name
              .toLowerCase()
              .includes(searchTerm);

            if (!matchesDescription && !matchesCategoryName) {
              return false;
            }
          }

          return true;
        });

        const { pageSize } = get().pagination;
        const totalPages = Math.ceil(filteredExpenses.length / pageSize);

        set((state) => ({
          allExpenses: updatedAllExpenses,
          pagination: {
            ...state.pagination,
            totalPages,
          },
          expensesLoading: false,
        }));

        // Update current page view
        get().setPage(1); // Go to first page to see the new expense
        return true;
      }
      throw new Error(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const response = await axios.put(
        `/api/expenses/update/${expenseId}`,
        updatedData
      );
      if (response.data.success) {
        // Update in all expenses
        const updatedAllExpenses = get().allExpenses.map((expense) =>
          expense.id === expenseId ? { ...expense, ...updatedData } : expense
        );

        set(() => ({
          allExpenses: updatedAllExpenses,
          expensesLoading: false,
        }));

        // Update current page view
        const currentPage = get().pagination.page;
        get().setPage(currentPage);
        return true;
      }
      throw new Error(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        expensesError:
          error.response?.data?.message || "Failed to update expense",
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
        // Remove from all expenses
        const updatedAllExpenses = get().allExpenses.filter(
          (expense) => expense.id !== expenseId
        );

        // Recalculate pagination based on filtered expenses
        const filteredExpenses = get()
          .getFilteredExpenses()
          .filter((expense) => expense.id !== expenseId);

        const { pageSize, page } = get().pagination;
        const totalPages = Math.ceil(filteredExpenses.length / pageSize);

        // Determine if we need to go to previous page
        let newPage = page;
        if (page > totalPages && totalPages > 0) {
          newPage = totalPages;
        }

        set((state) => ({
          allExpenses: updatedAllExpenses,
          pagination: {
            ...state.pagination,
            totalPages,
            page: newPage,
          },
          expensesLoading: false,
        }));

        // Update current page view
        get().setPage(newPage);
        return true;
      }
      throw new Error(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        expensesError:
          error.response?.data?.message || "Failed to delete expense",
        expensesLoading: false,
      });
      return false;
    }
  },
}));
