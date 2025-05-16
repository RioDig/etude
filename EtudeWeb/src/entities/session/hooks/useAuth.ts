import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '../api/sessionApi'
import { useCallback, useEffect } from 'react'
import { LoginCredentials, RegisterData } from '../model/types'
import { useSessionStore } from '@/entities/session/model/store.ts'
import { User } from '@/shared/types'

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
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 15,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1
  })

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
    setUser,
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
