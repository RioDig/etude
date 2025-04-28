// src/entities/session/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '../api/sessionApi'
import { useCallback, useState } from 'react'
import { User } from '@/entities/user'
import { LoginCredentials, RegisterData } from '../model/types'
import { useSessionStore } from '@/entities/session/model/store.ts'

export const useAuth = () => {
  const queryClient = useQueryClient()
  // const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Используем состояние для отслеживания, когда запрос находится в процессе
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Обновленный хук с вынесенной функцией запроса
  const fetchUserProfile = useCallback(async () => {
    try {
      // Предотвращаем повторные запросы во время выполнения
      if (isRefreshing) return null

      setIsRefreshing(true)
      const userData = await sessionApi.getCurrentUser()
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      clearSession()
      return null
    } finally {
      setIsRefreshing(false)
    }
  }, [clearSession, setUser, isRefreshing])

  // Используем React Query с кастомной функцией запроса
  const { isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated, // Запускаем только если пользователь авторизован
    staleTime: 1000 * 60 * 5, // 5 секунд для тестирования
    gcTime: 1000 * 60 * 10, // 10 минут до удаления из кэша
    retry: false
  })

  // Функция обновления профиля, которая принудительно запрашивает данные с сервера
  const refreshSession = useCallback(async () => {
    try {
      // Очищаем кэш перед запросом, чтобы гарантировать свежие данные
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      const result = await refetch()
      return result.data
    } catch (error) {
      console.error('Error refreshing session:', error)
      clearSession()
      return null
    }
  }, [refetch, queryClient, clearSession])

  // Функция инициализации
  const initAuth = useCallback(async () => {
    if (!initialized) {
      try {
        await refreshSession()
        setInitialized(true)
      } catch (error) {
        clearSession()
        setInitialized(true)
      }
    }
  }, [initialized, refreshSession, clearSession, setInitialized])

  // // Устанавливаем интервал обновления сессии
  // useEffect(() => {
  //   // Очищаем предыдущий интервал, если он был установлен
  //   if (refreshIntervalRef.current) {
  //     clearInterval(refreshIntervalRef.current)
  //     refreshIntervalRef.current = null
  //   }
  //
  //   if (isAuthenticated) {
  //     // Устанавливаем новый интервал
  //     refreshIntervalRef.current = setInterval(() => {
  //       refreshSession().catch(console.error)
  //     }, 1000 * 5) // Каждые 30 секунд
  //   }
  //
  //   // Очистка интервала при размонтировании компонента
  //   return () => {
  //     if (refreshIntervalRef.current) {
  //       clearInterval(refreshIntervalRef.current)
  //       refreshIntervalRef.current = null
  //     }
  //   }
  // }, [isAuthenticated, refreshSession])

  // Остальные мутации логина, регистрации и выхода
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
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    }
  })

  return {
    user,
    isAuthenticated,
    isLoading: isUserLoading || loginMutation.isPending || logoutMutation.isPending,
    isPending: loginMutation.isPending,
    error,
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
