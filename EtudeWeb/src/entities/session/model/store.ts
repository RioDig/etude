import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/entities/user'
import { SessionState } from './types'

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
        // Храним все данные пользователя
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          initialized: state.initialized
        }),
        // Добавляем версионирование для возможности миграции при изменении структуры данных
        version: 1,
        // Можно добавить миграции, если в будущем изменится структура
        migrate: (persistedState: any, version) => {
          if (version === 0) {
            // миграция с версии 0 на версию 1
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
