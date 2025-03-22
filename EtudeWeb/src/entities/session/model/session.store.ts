import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SessionStore } from './types';

export const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }),
        logout: () =>
          set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'session',
      }
    )
  )
);