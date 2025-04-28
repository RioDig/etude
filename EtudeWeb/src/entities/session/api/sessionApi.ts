// src/entities/session/api/sessionApi.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { User } from '@/entities/user'
import { LoginCredentials, RegisterData } from '../model/types'
import { API_URL } from '@/shared/config'

// Создаем инстанс axios для работы с бэкендом
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Важно для работы с HTTP-only cookies
})

// Перехватчик ответов для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Пытаемся обновить токен
        await api.post('/auth/refresh-token')

        // Повторяем оригинальный запрос
        return api(originalRequest)
      } catch (refreshError) {
        // Если не удается обновить токен, нужно обработать на уровне хука useAuth
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const sessionApi = {
  // Авторизация пользователя
  login: async (credentials: LoginCredentials): Promise<User> => {
    await api.post('/auth/email-login', credentials)
    // Запрашиваем данные о пользователе, так как логин не возвращает информацию
    return sessionApi.getCurrentUser()
  },

  // Регистрация пользователя
  register: async (data: RegisterData): Promise<User> => {
    await api.post('/auth/register', data)
    // Запрашиваем данные о пользователе после регистрации
    return sessionApi.getCurrentUser()
  },

  // Получение данных текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/user/me')
    return data
  },

  // Выход из системы
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // Обновление токена
  refreshToken: async (): Promise<void> => {
    await api.post('/auth/refresh-token')
  }
}
