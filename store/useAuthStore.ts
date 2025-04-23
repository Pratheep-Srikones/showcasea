import { UserType } from "@/types/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  setUser: (user: UserType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: (router: AppRouterInstance) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: UserType | null) => set({ user }),
      setIsAuthenticated: (isAuthenticated: boolean) =>
        set({ isAuthenticated }),
      logout: (router: AppRouterInstance) => {
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
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
