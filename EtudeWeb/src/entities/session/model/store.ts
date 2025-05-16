import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SessionState } from './types'
import { User } from '@/shared/types'

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

        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          initialized: state.initialized
        }),

        version: 1,

        migrate: (persistedState: any, version) => {
          if (version === 0) {
            return {
              ...persistedState,
              initialized: true
            }
          }
          return persistedState as SessionState
        }
      }
    )
  )
)
