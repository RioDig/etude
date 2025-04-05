import { useState, useEffect } from 'react';
import { useSessionStore } from './store';
import { sessionApi } from '../api/sessionApi';
import { LoginCredentials, RegisterData } from './types';
import { User } from '@/entities/user';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialized,
    setUser,
    setLoading,
    setError,
    setInitialized,
    logout: clearSession
  } = useSessionStore();

  const [localLoading, setLocalLoading] = useState(false);

  // Инициализация: проверяем текущего пользователя при первой загрузке
  useEffect(() => {
    if (!initialized) {
      const initializeAuth = async () => {
        setLoading(true);
        try {
          const currentUser = await sessionApi.login({email: 'admin@example.com', password: '123456'}); // TODO: поменять на sessionApi.getCurrentUser
          setUser(currentUser);
        } catch (err) {
          console.log('No active session');
          clearSession();
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      };

      initializeAuth();
    }
  }, [initialized, setInitialized, setLoading, setUser, clearSession]);

  // Функция для входа в систему
  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setLocalLoading(true);
    setError(null);

    try {
      const user = await sessionApi.login(credentials);
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Ошибка при входе в систему';
      setError(errorMessage);
      return null;
    } finally {
      setLocalLoading(false);
    }
  };

  // Функция для регистрации
  const register = async (data: RegisterData): Promise<User | null> => {
    setLocalLoading(true);
    setError(null);

    try {
      const user = await sessionApi.register(data);
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Ошибка при регистрации';
      setError(errorMessage);
      return null;
    } finally {
      setLocalLoading(false);
    }
  };

  // Функция для выхода из системы
  const logout = async (): Promise<void> => {
    setLocalLoading(true);

    try {
      await sessionApi.logout();
      clearSession();
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      // Даже если произошла ошибка, всё равно очищаем сессию на клиенте
      clearSession();
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || localLoading,
    initialized,
    error,
    login,
    register,
    logout
  };
};