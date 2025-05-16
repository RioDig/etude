import axios from 'axios'
import { API_URL } from '@/shared/config'
import { Report, ReportFilterParam } from '@/shared/types'
import { MOCK_REPORTS, delay } from './mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const reportApi = {
  /**
   * Получение списка отчетов с возможностью фильтрации
   */
  getReports: async (filters?: ReportFilterParam[]): Promise<Report[]> => {
    try {
      const { data } = await api.get<Report[]>('/Report1', { params: { filter: filters } })
      return data
    } catch (error) {
      console.error('Error fetching reports:', error)

      await delay(800)

      if (filters && filters.length > 0) {
        return MOCK_REPORTS.filter((report) => {
          return filters.every((filter) => {
            switch (filter.name) {
              case 'filter_type':
                return report.report_type === filter.value
              case 'date':
                return (
                  new Date(report.report_createDate).toISOString().split('T')[0] === filter.value
                )
              default:
                return true
            }
          })
        })
      }

      return MOCK_REPORTS
    }
  },

  /**
   * Скачивание отчета по ID
   */
  downloadReport: async (id: string): Promise<Blob> => {
    try {
      const response = await api.get('/Report/download', {
        params: { id },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error(`Error downloading report with id ${id}:`, error)

      await delay(1200)

      return new Blob([''], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  },

  /**
   * Генерация нового отчета
   */
  generateReport: async (): Promise<Blob> => {
    try {
      const response = await api.get('/Report/generate', {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error generating report:', error)

      await delay(2000)

      return new Blob([''], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  }
}
