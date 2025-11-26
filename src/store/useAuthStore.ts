import { User } from "@/interfaces/user";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUser: (user: User | null) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
