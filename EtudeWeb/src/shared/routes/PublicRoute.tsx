import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/entities/session'
import { Spinner } from '@/shared/ui/spinner'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * Компонент для защиты публичных маршрутов от авторизованных пользователей
 * Если пользователь авторизован, перенаправляет на главную страницу
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, refreshSession } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshSession()
      } finally {
        setTimeout(() => {
          setIsChecking(false)
        }, 500)
      }
    }

    checkAuth()
  }, [refreshSession])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="medium" label="Проверка авторизации..." className="leading-none" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
