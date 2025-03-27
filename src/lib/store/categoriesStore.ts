import axios from "axios";
import { create } from "zustand";

export interface Category {
  id: string;
  name: string;
  limit: number;
  icon: string;
  color: string;
  remaining?: number;
  createdAt?: number;
}

export interface Categories {
  categories: Category[];
}

interface CategoriesState {
  categories: Categories | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
  // Pagination state
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  // All categories (for client-side pagination)
  allCategories: Category[];
  // Pagination methods
  setPageSize: (size: number) => void;
  setPage: (page: number) => void;
  getPaginatedCategories: () => Category[];
  // CRUD operations
  fetchCategories: () => Promise<void>;
  addCategory: (addedData: Partial<Category>) => Promise<boolean>;
  updateCategory: (
    updatedData: Partial<Category>,
    categoryId: string
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: null,
  categoriesLoading: false,
  categoriesError: null,
  allCategories: [],
  pagination: {
    page: 1,
    pageSize: 8, // Default page size
    totalPages: 1,
  },

  // Set page size and recalculate total pages
  setPageSize: (size) => {
    const allCats = get().allCategories;
    const totalPages = Math.ceil(allCats.length / size);

    set((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: size,
        page: 1, // Reset to first page when changing page size
        totalPages,
      },
      // Update the paginated view
      categories: {
        categories: allCats.slice(0, size),
      },
    }));
  },

  // Set current page
  setPage: (page) => {
    const { pageSize } = get().pagination;
    const allCats = get().allCategories;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCategories = allCats.slice(startIndex, endIndex);

    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
      // Update the paginated view with the correct slice
      categories: {
        categories: paginatedCategories,
      },
    }));
  },

  // Get current page of categories
  getPaginatedCategories: () => {
    const { page, pageSize } = get().pagination;
    const allCats = get().allCategories;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return allCats.slice(startIndex, endIndex);
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.get("/api/category");
      const allCategories = response.data.categories;

      // Calculate total pages
      const { pageSize } = get().pagination;
      const totalPages = Math.ceil(allCategories.length / pageSize);

      // Get current page of categories
      const currentPage = get().pagination.page;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCategories = allCategories.slice(startIndex, endIndex);

      set({
        allCategories,
        categories: {
          categories: paginatedCategories,
        },
        categoriesLoading: false,
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
        categoriesError:
          error.response?.data?.message || "Failed to load categories",
        categoriesLoading: false,
      });
    }
  },

  addCategory: async (addedData) => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.post("/api/category/add", addedData);
      if (response.data.success) {
        // Add to all categories
        const newCategory = response.data.category;
        const updatedAllCategories = [newCategory, ...get().allCategories];

        // Recalculate pagination
        const { pageSize } = get().pagination;
        const totalPages = Math.ceil(updatedAllCategories.length / pageSize);

        set((state) => ({
          allCategories: updatedAllCategories,
          pagination: {
            ...state.pagination,
            totalPages,
          },
          categoriesLoading: false,
        }));

        // Update current page view
        get().setPage(1); // Go to first page to see the new category
        return true;
      }
      throw new Error(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        categoriesError:
          error.response?.data?.message || "Failed to add category",
        categoriesLoading: false,
      });
      return false;
    }
  },

  updateCategory: async (updatedData, categoryId) => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.put(
        `/api/category/update/${categoryId}`,
        updatedData
      );
      if (response.data.success) {
        // Update in all categories
        const updatedAllCategories = get().allCategories.map((category) =>
          category.id === categoryId
            ? { ...category, ...updatedData }
            : category
        );

        set((state) => ({
          allCategories: updatedAllCategories,
          categoriesLoading: false,
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
        categoriesError:
          error.response?.data?.message || "Failed to update category",
        categoriesLoading: false,
      });
      return false;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.delete(`/api/category/delete/${categoryId}`);
      if (response.data.success) {
        // Remove from all categories
        const updatedAllCategories = get().allCategories.filter(
          (category) => category.id !== categoryId
        );

        // Recalculate pagination
        const { pageSize, page } = get().pagination;
        const totalPages = Math.ceil(updatedAllCategories.length / pageSize);

        // Determine if we need to go to previous page
        let newPage = page;
        if (page > totalPages && totalPages > 0) {
          newPage = totalPages;
        }

        set((state) => ({
          allCategories: updatedAllCategories,
          pagination: {
            ...state.pagination,
            totalPages,
            page: newPage,
          },
          categoriesLoading: false,
        }));

        // Update current page view
        get().setPage(newPage);
        return true;
      }
      throw new Error(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        categoriesError:
          error.response?.data?.message || "Failed to delete category",
        categoriesLoading: false,
      });
      return false;
    }
  },
}));
