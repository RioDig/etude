// src/shared/routes/PublicRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/entities/session'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * Компонент для защиты публичных маршрутов от авторизованных пользователей
 * Если пользователь авторизован, перенаправляет на главную страницу
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
