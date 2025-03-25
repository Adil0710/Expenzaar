import axios from "axios";
import { create } from "zustand";

export interface Profile {
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
      // Ensure values are defined before updating state
      const profileUpdatePayload = {
        name: updatedData.user?.name ?? "",
        email: updatedData.user?.email ?? "",
        salary: updatedData.user?.salary ?? 0,
      };

      const response = await axios.put(
        "/api/profile/update",
        profileUpdatePayload
      );

      if (response.data.success) {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                user: {
                  ...state.profile.user,
                  ...profileUpdatePayload,
                },
              }
            : null,
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
