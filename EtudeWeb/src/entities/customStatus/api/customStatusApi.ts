import axios from 'axios'
import { API_URL } from '@/shared/config'
import { CustomStatus } from '@/shared/types'
import { delay, MOCK_CUSTOM_STATUSES } from './mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const customStatusApi = {
  /**
   * Получение списка дополнительных статусов
   */
  getCustomStatuses: async (): Promise<CustomStatus[]> => {
    try {
      const { data } = await api.get<CustomStatus[]>('/CustomStatus')
      return data
    } catch (error) {
      console.error('Error fetching custom statuses:', error)

      throw new Error('Error fetching custom statuses')
    }
  },

  /**
   * Получение дополнительного статуса по ID
   */
  getCustomStatusById: async (id: string): Promise<CustomStatus> => {
    try {
      const { data } = await api.get<CustomStatus>(`/CustomStatus/${id}`)
      return data
    } catch (error) {
      console.error(`Error fetching custom status with id ${id}:`, error)

      await delay(500)
      const status = MOCK_CUSTOM_STATUSES.find((s) => s.id === id)
      if (!status) {
        throw new Error(`Custom status with id ${id} not found`)
      }
      return status
    }
  },

  /**
   * Создание нового дополнительного статуса
   */
  createCustomStatus: async (statusData: Omit<Omit<CustomStatus, 'type'>, 'id'>): Promise<CustomStatus> => {
    try {
      const { data } = await api.post<CustomStatus>('/CustomStatus', statusData)
      return data
    } catch (error) {
      console.error('Error creating custom status:', error)

      await delay(1000)
      return {
        id: String(Date.now()),
        ...statusData
      }
    }
  },

  /**
   * Обновление дополнительного статуса
   */
  updateCustomStatus: async (
    id: string,
    statusData: Omit<CustomStatus, 'id'>
  ): Promise<CustomStatus> => {
    try {
      const { data } = await api.patch<CustomStatus>(`/CustomStatus/${id}`, statusData)
      return data
    } catch (error) {
      console.error(`Error updating custom status with id ${id}:`, error)

      await delay(800)
      return {
        id,
        ...statusData
      }
    }
  },

  /**
   * Удаление дополнительного статуса
   */
  deleteCustomStatus: async (id: string): Promise<void> => {
    try {
      await api.delete(`/CustomStatus/${id}`)
    } catch (error) {
      console.error(`Error deleting custom status with id ${id}:`, error)

      await delay(600)
    }
  }
}
