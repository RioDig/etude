import axios from 'axios'
import { User } from '@/entities/user'
import { LoginCredentials, RegisterData } from '../model/types'
import { API_URL } from '@/shared/config'

// Создаем инстанс axios для работы с бэкендом
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Важно для работы с HTTP-only cookies
})

export const sessionApi = {
  // Авторизация пользователя
  login: async (credentials: LoginCredentials): Promise<User> => {
    await api.post('/auth/login', credentials)
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
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  // Выход из системы
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  }
}
