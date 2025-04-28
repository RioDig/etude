// src/entities/session/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { sessionApi } from '../api/sessionApi'

import { useCallback } from 'react'
import { User } from '@/entities/user'
import { LoginCredentials, RegisterData } from '@/entities/session'
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

  // Обновленный хук с правильной структурой опций
  const { isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: sessionApi.getCurrentUser,
    enabled: false, // Не запускать автоматически
    // React Query 5 разделяет обработчики результатов
    // и ошибок на отдельные методы, а не в опциях
    // Удаляем onSuccess и onError из опций
    retry: false,
    staleTime: 1000 * 60 * 5 // 5 минут
  })

  // Функция инициализации с обработкой успеха и ошибки
  const initAuth = useCallback(async () => {
    if (!initialized) {
      try {
        const result = await refetch()
        if (result.data) {
          setUser(result.data)
        }
        setInitialized(true)
      } catch (error) {
        clearSession()
        setInitialized(true)
      }
    }
  }, [initialized, refetch, setUser, clearSession, setInitialized])

  // Мутация для авторизации с правильной обработкой результатов
  const loginMutation = useMutation({
    mutationFn: sessionApi.login,
    onSuccess: (userData: User) => {
      // Явный тип для userData
      setUser(userData)
      queryClient.setQueryData(['auth', 'me'], userData)
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  // Мутация для регистрации
  const registerMutation = useMutation({
    mutationFn: sessionApi.register,
    onSuccess: (userData: User) => {
      // Явный тип для userData
      setUser(userData)
      queryClient.setQueryData(['auth', 'me'], userData)
    },
    onError: (error: Error) => {
      setError(error.message)
    }
  })

  // Мутация для выхода
  const logoutMutation = useMutation({
    mutationFn: sessionApi.logout,
    onSuccess: () => {
      clearSession()
      // Используем await для решения проблемы с игнорированием Promise
      void queryClient.invalidateQueries({ queryKey: ['auth'] })
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
