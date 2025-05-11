import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface Template {
  id: string
  type: string
  name: string
  duration?: string
  format: string
  category: string
  trainingCenter?: string
  startDate?: string
  endDate?: string
}

// Создаем инстанс axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

// Моковые данные для демонстрации
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    type: 'Курс',
    name: 'JavaScript для начинающих',
    duration: '6 месяцев',
    format: 'Онлайн',
    category: 'Hard Skills',
    trainingCenter: 'Учебный центр "Программист"',
    startDate: '2025-06-01',
    endDate: '2025-12-01'
  },
  {
    id: '2',
    type: 'Конференция',
    name: 'DevOps Summit 2025',
    format: 'Очно',
    category: 'Hard Skills',
    trainingCenter: 'Конгресс-центр "Меридиан"',
    startDate: '2025-08-15',
    endDate: '2025-08-17'
  },
  {
    id: '3',
    type: 'Тренинг',
    name: 'Лидерство и управление командой',
    duration: '3 дня',
    format: 'Смешанный',
    category: 'Soft Skills',
    startDate: '2025-07-10',
    endDate: '2025-07-12'
  },
  {
    id: '4',
    type: 'Вебинар',
    name: 'Новые технологии в веб-разработке',
    format: 'Онлайн',
    category: 'Hard Skills',
    startDate: '2025-05-25',
    endDate: '2025-05-25'
  }
]

// Задержка для имитации запроса к серверу
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const templateApi = {
  // Получение всех шаблонов
  getTemplates: async (filters?: Record<string, any>): Promise<Template[]> => {
    try {
      // В реальном приложении используем реальное API
      // const { data } = await api.get('/templates', { params: filters })
      // return data

      // Для тестирования используем мок-данные
      await delay(1000)

      let templates = [...MOCK_TEMPLATES]

      // Применяем фильтры, если они есть
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            templates = templates.filter((template) => {
              const templateValue = template[key as keyof Template]
              if (typeof templateValue === 'string') {
                return templateValue.toLowerCase().includes(value.toLowerCase())
              }
              return templateValue === value
            })
          }
        })
      }

      return templates
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  },

  // Обновление шаблона (заглушка)
  updateTemplate: async (id: string, template: Partial<Template>): Promise<Template> => {
    // const { data } = await api.put(`/templates/${id}`, template)
    // return data
    await delay(500)
    return { ...MOCK_TEMPLATES[0], ...template }
  },

  // Удаление шаблона (заглушка)
  deleteTemplate: async (id: string): Promise<void> => {
    // await api.delete(`/templates/${id}`)
    await delay(500)
  }
}