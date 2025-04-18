import { User } from "@/types/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: (router: AppRouterInstance) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: User | null) => set({ user }),
      setIsAuthenticated: (isAuthenticated: boolean) =>
        set({ isAuthenticated }),
      logout: (router: AppRouterInstance) => {
        set({ user: null, isAuthenticated: false });
        router.push("/auth?tab=login");

        //localStorage.removeItem("token"); // You can keep this if you're storing token separately
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
