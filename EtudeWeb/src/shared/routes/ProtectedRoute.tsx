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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requiredRoles={[USER_ROLES.admin]}>{children}</ProtectedRoute>
}
