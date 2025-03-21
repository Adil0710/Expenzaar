import axios from "axios";
import { create } from "zustand";

interface Profile {
  user: {
    name: string;
    email: string;
    salary: number;
    createdAt: string;
  };
}

interface ProfileState {
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedData: Partial<Profile>) => Promise<boolean>;
  updatePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<boolean>;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const response = await axios.put("/api/profile/update", updatedData);
      if (response.data.success) {
        // Update the local profile state with the new data
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updatedData } : null,
          profileLoading: false,
        }));
        return true;
      }
      throw new Error(response.data.message);
    } catch (error: any) {
      set({
        profileError:
          error.response?.data?.message || "Failed to update profile",
        profileLoading: false,
      });
      return false;
    }
  },

  updatePassword: async (passwords) => {
    set({ profileLoading: true, profileError: null });

    try {
      const response = await axios.put("/api/profile/update", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      set({ profileLoading: false });
      return response.data.success;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        profileError:
          error.response?.data?.message || "Failed to update password",
        profileLoading: false,
      });
      return false;
    }
  },
}));
