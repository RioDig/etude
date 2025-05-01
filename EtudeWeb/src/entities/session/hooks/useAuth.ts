// Обновить в src/entities/session/hooks/useAuth.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '../api/sessionApi'
import { useCallback, useEffect } from 'react'
import { User } from '@/entities/user'
import { LoginCredentials, RegisterData } from '../model/types'
import { useSessionStore } from '@/entities/session/model/store.ts'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const {
    user,
    isAuthenticated,
    error,
    setUser,
    setError,
    logout: clearSession,
    initialized,
    setInitialized
  } = useSessionStore()

  // Запрос данных пользователя с оптимальными настройками React Query
  const { isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const userData = await sessionApi.getCurrentUser()
        setUser(userData)
        return userData
      } catch (error) {
        console.error('Error fetching user profile:', error)
        clearSession()
        return null
      }
    },
    enabled: isAuthenticated, // Запускаем только если пользователь авторизован
    staleTime: 1000 * 60 * 15, // Данные считаются свежими 15 минут
    gcTime: 1000 * 60 * 30, // Данные хранятся в кеше 30 минут
    refetchInterval: 1000 * 60 * 15, // Автоматическое обновление каждые 15 минут
    refetchIntervalInBackground: false, // Не обновлять, когда вкладка не активна
    refetchOnWindowFocus: false, // Не обновлять при фокусе окна
    refetchOnMount: true, // Обновлять при монтировании, если данные устарели
    retry: 1 // Одна повторная попытка при ошибке
  })

  // Простая функция обновления сессии, используя refetch из React Query
  const refreshSession = useCallback(async () => {
    try {
      const result = await refetch()
      return result.data
    } catch (error) {
      console.error('Error refreshing session:', error)
      clearSession()
      return null
    }
  }, [refetch, clearSession])

  // Функция инициализации
  const initAuth = useCallback(async () => {
    if (!initialized) {
      try {
        await refreshSession()
        setInitialized(true)
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearSession()
        setInitialized(true)
      }
    }
  }, [initialized, refreshSession, clearSession, setInitialized])

  // Слушаем события изменения localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session-storage' && e.newValue !== e.oldValue) {
        console.log('Обнаружено изменение session-storage в другой вкладке')
        refreshSession().catch(console.error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshSession])

  // Мутации для логина, регистрации и выхода
  const loginMutation = useMutation({
    mutationFn: sessionApi.login,
    onSuccess: (userData: User) => {
      setUser(userData)
      queryClient.setQueryData(['auth', 'me'], userData)
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const registerMutation = useMutation({
    mutationFn: sessionApi.register,
    onSuccess: (userData: User) => {
      setUser(userData)
      queryClient.setQueryData(['auth', 'me'], userData)
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  const logoutMutation = useMutation({
    mutationFn: sessionApi.logout,
    onSuccess: () => {
      clearSession()
      // Удаляем запросы вместо инвалидации
      queryClient.removeQueries({ queryKey: ['auth'] })
    }
  })

  return {
    user,
    isAuthenticated,
    isLoading: isUserLoading || loginMutation.isPending || logoutMutation.isPending,
    isPending: loginMutation.isPending,
    error,
    setError,
    setUser, // Экспортируем, чтобы можно было устанавливать пользователя извне
    initialized,
    initAuth,
    refreshSession,
    login: (credentials: LoginCredentials) => {
      return new Promise((resolve, reject) => {
        loginMutation.mutate(credentials, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error)
        })
      })
    },
    register: (data: RegisterData) => {
      return new Promise((resolve, reject) => {
        registerMutation.mutate(data, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error)
        })
      })
    },
    logout: () => {
      return new Promise((resolve, reject) => {
        logoutMutation.mutate(undefined, {
          onSuccess: () => resolve(undefined),
          onError: (error) => reject(error)
        })
      })
    }
  }
}
