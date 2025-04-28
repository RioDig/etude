import { useEffect } from 'react';
import { useAuth } from '@/entities/session'
import { useSessionStore } from '@/entities/session/model/store'


export const useSessionCheck = () => {
  const { isAuthenticated } = useSessionStore();
  const { user, isLoading, refreshSession } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return; // если юзер не залогинен — ничего не делаем

    if (!user && !isLoading) {
      // если юзер данных нет, и сейчас нет запроса — рефрешим
      refreshSession();
    }
  }, [isAuthenticated, user, isLoading, refreshSession]);
};
