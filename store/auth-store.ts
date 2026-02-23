import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClientCreate } from "@/types/appointment";

interface AuthState {
  loggedInClient: ClientCreate | null;
  isLoggedIn: boolean;
  setLoggedInClient: (client: ClientCreate | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loggedInClient: null,
      isLoggedIn: false,
      setLoggedInClient: (client) =>
        set({ loggedInClient: client, isLoggedIn: !!client }),
      logout: () => set({ loggedInClient: null, isLoggedIn: false }),
    }),
    { name: "bookngon-auth" }
  )
);
