import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface AdditionalStatus {
  id: string
  name: string
  description: string
}

// Создаем инстанс axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

// Моковые данные для демонстрации
const MOCK_STATUSES: AdditionalStatus[] = [
  {
    id: '1',
    name: 'Ожидает подтверждения',
    description: 'Статус присваивается, когда заявка ожидает подтверждения от руководителя'
  },
  {
    id: '2',
    name: 'В процессе согласования',
    description: 'Статус присваивается во время прохождения согласования различными отделами'
  },
  {
    id: '3',
    name: 'Требует дополнительной информации',
    description: 'Статус присваивается, когда для принятия решения требуется доп. информация'
  },
  {
    id: '4',
    name: 'Предварительно одобрено',
    description: 'Статус присваивается после первичного одобрения, но до финального решения'
  },
  {
    id: '5',
    name: 'Отложено',
    description: 'Статус присваивается, когда рассмотрение заявки временно приостановлено'
  }
]

// Задержка для имитации запроса к серверу
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const statusApi = {
  // Получение всех статусов
  getStatuses: async (filters?: Record<string, any>): Promise<AdditionalStatus[]> => {
    try {
      // В реальном приложении используем реальное API
      // const { data } = await api.get('/statuses', { params: filters })
      // return data

      // Для тестирования используем мок-данные
      await delay(1000)

      let statuses = [...MOCK_STATUSES]

      // Применяем фильтры, если они есть
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            statuses = statuses.filter((status) => {
              const statusValue = status[key as keyof AdditionalStatus]
              if (typeof statusValue === 'string') {
                return statusValue.toLowerCase().includes(value.toLowerCase())
              }
              return statusValue === value
            })
          }
        })
      }

      return statuses
    } catch (error) {
      console.error('Error fetching statuses:', error)
      throw error
    }
  },

  // Обновление статуса (заглушка)
  updateStatus: async (id: string, status: Partial<AdditionalStatus>): Promise<AdditionalStatus> => {
    // const { data } = await api.put(`/statuses/${id}`, status)
    // return data
    await delay(500)
    return { ...MOCK_STATUSES[0], ...status }
  },

  // Удаление статуса (заглушка)
  deleteStatus: async (id: string): Promise<void> => {
    // await api.delete(`/statuses/${id}`)
    await delay(500)
  }
}