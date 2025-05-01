import React, { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/entities/session'
import { USER_ROLES, UserRole } from '@/entities/user'
import { useQueryClient } from '@tanstack/react-query'
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, refreshSession } = useAuth()
  const location = useLocation()
  const hasCheckedSessionRef = useRef(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isAuthenticated && !hasCheckedSessionRef.current) {
      hasCheckedSessionRef.current = true
      refreshSession().catch(console.error)
    }

    return () => {
      hasCheckedSessionRef.current = false
    }
  }, [isAuthenticated, queryClient, location.pathname])

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Если требуются определенные роли и пользователь не имеет нужной роли
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    // Перенаправляем на доступную страницу или на страницу с ошибкой доступа
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}

// Специализированный защищенный маршрут только для администраторов
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requiredRoles={[USER_ROLES.admin]}>{children}</ProtectedRoute>
}
