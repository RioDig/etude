import axios from 'axios'
import { API_URL } from '@/shared/config'
import { Application, PastEvent } from '@/shared/types'
import { ApplicationCreateData } from '@/shared/types/applicationCreate'
import { delay, MOCK_APPLICATIONS, MOCK_PAST_EVENTS } from './mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const applicationApi = {
  /**
   * Получение списка заявлений с возможностью фильтрации
   */
  getApplications: async (filters?: Record<string, any>): Promise<Application[]> => {
    try {
      const { data } = await api.get<Application[]>('/Application', { params: filters })
      return data
    } catch (error) {
      console.error('Error fetching applications:', error)

      await delay(800)

      if (filters && Object.keys(filters).length > 0) {
        return MOCK_APPLICATIONS.filter((app) => {
          let match = true
          for (const [key, value] of Object.entries(filters)) {
            if (key === 'status' && value && app.status.type !== value) {
              match = false
            }
          }
          return match
        })
      }

      return MOCK_APPLICATIONS
    }
  },

  /**
   * Создание нового заявления
   */
  createApplication: async (applicationData: ApplicationCreateData): Promise<Application> => {
    try {
      const { data } = await api.post<Application>('/Application', applicationData)
      return data
    } catch (error) {
      console.error('Error creating application:', error)

      throw new Error(`Error creating application:${error}`)
    }
  },

  /**
   * Получение заявления по ID
   */
  getApplicationById: async (id: string): Promise<Application> => {
    try {
      const { data } = await api.get<Application>(`/Application/${id}`)
      return data
    } catch (error) {
      console.error(`Error fetching application with id ${id}:`, error)

      await delay(500)

      const application = MOCK_APPLICATIONS.find((app) => app.application_id === id)
      if (!application) {
        throw new Error(`Application with id ${id} not found`)
      }

      return application
    }
  },

  /**
   * Получение прошедших мероприятий пользователя
   */
  getUserPastEvents: async (): Promise<PastEvent[]> => {
    try {
      const { data } = await api.get<PastEvent[]>('/Application/past')
      return data
    } catch (error) {
      console.error('Error fetching user past events:', error)

      await delay(800)

      return MOCK_PAST_EVENTS
    }
  }
}
