import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClientCreate } from "@/types/appointment";

interface AuthState {
  loggedInClient: ClientCreate | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setLoggedInClient: (client: ClientCreate | null) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loggedInClient: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      setLoggedInClient: (client) =>
        set({ loggedInClient: client, isLoggedIn: !!client }),
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      logout: () =>
        set({
          loggedInClient: null,
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    { name: "bookngon-auth" }
  )
);
