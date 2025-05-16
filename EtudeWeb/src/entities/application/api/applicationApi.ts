import axios from 'axios'
import { API_URL } from '@/shared/config'
import { ApplicationEvent, ApplicationData } from '@/entities/application'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

const MOCK_EVENTS: ApplicationEvent[] = [
  {
    id: '1',
    title: 'Эффективная коммуникация в команде',
    description:
      'Курс направлен на развитие навыков эффективного взаимодействия в команде. Курс направлен на развитие навыков эффективного взаимодействия в команде.',
    type: 'conference',
    format: 'offline',
    category: 'soft-skills',
    startDate: new Date('2025-02-14'),
    endDate: new Date('2025-02-16')
  },
  {
    id: '2',
    title: 'Deep Learning в разработке',
    description:
      'Интенсивный курс по применению нейронных сетей и машинного обучения для разработки современных приложений.',
    type: 'course',
    format: 'online',
    category: 'hard-skills',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-04-15')
  },
  {
    id: '3',
    title: 'Agile: Scrum и Kanban',
    description: 'Обучение методологиям гибкой разработки на практике с анализом реальных кейсов.',
    type: 'training',
    format: 'mixed',
    category: 'management',
    startDate: new Date('2025-02-20'),
    endDate: new Date('2025-02-22')
  },
  {
    id: '4',
    title: 'Frontend разработка с React',
    description:
      'Полный курс по созданию современных веб-приложений с использованием React и сопутствующих технологий.',
    type: 'course',
    format: 'online',
    category: 'hard-skills',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-05-01')
  },
  {
    id: '5',
    title: 'Стратегический менеджмент',
    description:
      'Курс для руководителей и менеджеров, направленный на развитие стратегического мышления и планирования.',
    type: 'webinar',
    format: 'online',
    category: 'management',
    startDate: new Date('2025-04-05'),
    endDate: new Date('2025-04-06')
  },
  {
    id: '6',
    title: 'Публичные выступления',
    description:
      'Мастер-класс по подготовке и проведению публичных выступлений, презентаций и докладов.',
    type: 'training',
    format: 'offline',
    category: 'soft-skills',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-16')
  }
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const applicationApi = {
  getEventsCatalog: async (filters?: Record<string, any>): Promise<ApplicationEvent[]> => {
    try {
      // const { data } = await api.get('/applications/catalog', { params: filters });

      await delay(1000)

      if (filters && Object.keys(filters).length > 0) {
        return MOCK_EVENTS.filter((event) => {
          for (const [key, value] of Object.entries(filters)) {
            if (value && event[key as keyof ApplicationEvent] !== value) {
              return false
            }
          }
          return true
        })
      }

      return MOCK_EVENTS
    } catch (error) {
      console.error('Error fetching events catalog:', error)
      throw error
    }
  },

  getEventById: async (id: string): Promise<ApplicationEvent> => {
    try {
      // const { data } = await api.get(`/applications/events/${id}`);

      await delay(500)

      const event = MOCK_EVENTS.find((event) => event.id === id)
      if (!event) {
        throw new Error(`Event with id ${id} not found`)
      }

      return event
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error)
      throw error
    }
  },

  createApplication: async (applicationData: ApplicationData): Promise<ApplicationData> => {
    try {
      const { data } = await api.post('/application', applicationData)
      return data
    } catch (error) {
      console.error('Error creating application:', error)
      throw error
    }
  },

  updateApplication: async (
    id: string,
    updates: Partial<ApplicationData>
  ): Promise<ApplicationData> => {
    try {
      // const { data } = await api.patch(`/applications/${id}`, updates);

      await delay(1000)

      return {
        ...updates,
        id,
        updatedAt: new Date().toISOString()
      } as ApplicationData
    } catch (error) {
      console.error(`Error updating application with id ${id}:`, error)
      throw error
    }
  }
}
