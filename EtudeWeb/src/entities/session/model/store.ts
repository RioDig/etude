import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/entities/user';
import { SessionState } from './types';


export const useSessionStore = create<
  SessionState & {
    setUser: (user: User | null) => void
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    setInitialized: (initialized: boolean) => void
    logout: () => void
  }
>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        initialized: false,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null
          }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        setInitialized: (initialized) => set({ initialized }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
      }),
      {
        name: 'session-storage',
        // Храним только неконфиденциальные данные пользователя для UI
        partialize: (state) => ({
          user: state.user
            ? {
                id: state.user.id,
                firstName: state.user.firstName,
                lastName: state.user.lastName,
                role: state.user.role,
                avatar: state.user.avatar
              }
            : null,
          isAuthenticated: state.isAuthenticated
        })
      }
    )
  )
)