import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setError: (error: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  clearUser: () => set({ user: null }),
  setError: (error) => set({ error }),
}));