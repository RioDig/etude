// entities/session/api/sessionApi.ts
import axios from 'axios'
import { User } from '@/entities/user'
import { LoginCredentials } from '../model/types'
import { MOCK_USERS, delay } from './mockData'

// Создаем инстанс axios для работы с бэкендом
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
})

// Функция для определения режима работы (мок или реальный API)
const isMockMode = () => {
  return import.meta.env.VITE_MOCK_API === 'true'
}

export const sessionApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    if (isMockMode()) {
      // Имитируем задержку для более реалистичного поведения
      await delay(10)

      const user = MOCK_USERS.find((u) => u.email === credentials.email)

      if (!user) {
        throw new Error('Неверный email или пароль')
      }

      // Сохраняем в localStorage для имитации сохранения токена
      localStorage.setItem('mockUser', JSON.stringify(user))

      return user
    } else {
      // Реальный API запрос
      const { data } = await api.post<User>('/auth/login', credentials)
      return data
    }
  }

  // Остальные методы API...
}
