import { UserType } from "@/types/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  setUser: (user: UserType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: (router: AppRouterInstance) => void;

  socket: Socket | null;
  connectSocket: (userId: string) => Socket;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        get().disconnectSocket(); // Disconnect the socket on logout

        //localStorage.removeItem("token"); // You can keep this if you're storing token separately
      },
      socket: null,
      connectSocket: (userId: string) => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_PORT_URL as string, {
          query: { userId: userId },
        });
        return socket;
      },
      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== "socket")
        ),
    }
  )
);
