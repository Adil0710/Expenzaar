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
  fetchCategories: () => Promise<void>;
  addCategory: (addedData: Partial<Category>) => Promise<boolean>;
  updateCategory: (
    updatedData: Partial<Category>,
    categoryId: string
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: null,
  categoriesLoading: false,
  categoriesError: null,

  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.get("/api/category");

      set({ categories: response.data, categoriesLoading: false });
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
        set((state) => ({
          categories: state.categories
            ? {
                categories: [
                  ...state.categories.categories,
                  response.data.category,
                ],
              }
            : { categories: [response.data.category] },
          categoriesLoading: false,
        }));
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
        set((state) => ({
          categories: state.categories
            ? {
                categories: state.categories.categories.map((category) =>
                  category.id === categoryId
                    ? { ...category, ...updatedData }
                    : category
                ),
              }
            : null,
          categoriesLoading: false,
        }));
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
        set((state) => ({
          categories: state.categories
            ? {
                categories: state.categories.categories.filter(
                  (category) => category.id !== categoryId
                ),
              }
            : null,
          categoriesLoading: false,
        }));
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
