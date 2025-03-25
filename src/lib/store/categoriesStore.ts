import axios from "axios";
import { create } from "zustand";

interface Categories {
  categories: [
    {
      id: string;
      name: string;
      limit: number;
      icon: string;
      color: string;
      remaining: number;
    }
  ];
}

interface CategoriesState {
  categories: Categories | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
  fetchCategories: () => Promise<void>;
  updateCategories: (updatedData: Partial<Categories>) => Promise<boolean>;
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
      console.log("response is", response)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        categoriesError:
          error.response?.data?.message || "Failed to load categories",
        categoriesLoading: false,
      });
    }
  },

  updateCategories: async (updatedData) => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const response = await axios.put("/api/category/update", updatedData);
      if (response.data.success) {
        // Update the local profile state with the new data
        set((state) => ({
          categories: state.categories
            ? { ...state.categories, ...updatedData }
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
          error.response?.data?.message || "Failed to update profile",
        categoriesLoading: false,
      });
      return false;
    }
  },
}));
