import axios from 'axios'
import { API_URL } from '@/shared/config'
import { Template } from '@/entities/template/api/templateApi'

// Задержка для имитации запроса к серверу
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

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

export const scheduleApi = {
  /**
   * Получение всех мероприятий для расписания
   * @param filters Параметры фильтрации
   */
  getSchedule: async (filters?: Record<string, any>): Promise<Template[]> => {
    try {
      // В реальном приложении использовали бы реальное API
      // const { data } = await axios.get(`${API_URL}/schedule`, { params: filters })

      // Для прототипа используем темплейты из API темплейтов
      // Имитируем задержку
      await delay(800)

      let templates = [...MOCK_TEMPLATES]
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

      // Получаем данные из API шаблонов
      // const { data } = await api.get(`/templates`, { params: filters })
      // return data
    } catch (error) {
      console.error('Error fetching schedule:', error)
      throw error
    }
  }
}
