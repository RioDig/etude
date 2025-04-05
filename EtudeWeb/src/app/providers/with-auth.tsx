import React, { ReactNode } from 'react';
import { useAuth } from '@/entities/session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { initialized, isLoading } = useAuth();

  // Можно добавить загрузочный экран, пока проверяем аутентификацию
  if (!initialized && isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  return <>{children}</>;
};

export const withAuth = (component: () => ReactNode) => () => {
  return <AuthProvider>{component()}</AuthProvider>;
};
