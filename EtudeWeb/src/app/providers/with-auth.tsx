import React, { ReactNode, useEffect } from 'react'
import { useAuth } from '@/entities/session'
import { Spinner } from '@/shared/ui/spinner'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { initialized, initAuth } = useAuth()

  // Инициализация аутентификации при загрузке
  useEffect(() => {
    void initAuth()
  }, [initAuth])

  // Показываем индикатор загрузки, пока проверяем аутентификацию
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
