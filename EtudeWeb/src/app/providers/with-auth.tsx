import React, { ReactNode, useEffect } from 'react'
import { useAuth } from '@/entities/session'
import { Spinner } from '@/shared/ui/spinner'
import { useSessionCheck } from '@/entities/session/hooks/useSessionCheck'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { initialized, initAuth } = useAuth()
  useSessionCheck() // Используем хук вместо компонента

  useEffect(() => {
    void initAuth()
  }, [initAuth])

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="large" label="Загрузка приложения..." />
      </div>
    )
  }

  return <>{children}</>
}

export const withAuth = (component: () => ReactNode) => () => {
  return <AuthProvider>{component()}</AuthProvider>
}
