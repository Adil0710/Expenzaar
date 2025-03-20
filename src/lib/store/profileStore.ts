import axios from "axios";
import { create } from "zustand";

interface Profile {
  id: string;
  name: string;
  email: string;
  salary: number;
  createdAt: string;
}

interface ProfileState {
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedData: Partial<Profile>) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  profileLoading: false,
  profileError: null,

  fetchProfile: async () => {
    set({ profileLoading: true, profileError: null });

    try {
      const response = await axios.get("/api/profile");
      set({ profile: response.data, profileLoading: false });
    } catch (error: any) {
      set({
        profileError: error.response?.data?.message || "Failed to load profile",
        profileLoading: false,
      });
    }
  },

  updateProfile: async (updatedData) => {
    set({ profileLoading: true, profileError: null });

    try {
      const response = await axios.put("/api/update", updatedData);
      set({ profile: response.data, profileLoading: false });
      return true;
    } catch (error: any) {
        set({profileError: error.response?.data?.message || "Failed to update profile", profileLoading: false})
        return false
    }
  },
}));
