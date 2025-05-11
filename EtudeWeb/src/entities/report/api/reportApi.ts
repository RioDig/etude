import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface Report {
  id: string
  formationDate: string
  type: string
}

// Создаем инстанс axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

// Моковые данные для демонстрации
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    formationDate: '13.05.2024',
    type: 'Отчет по завершенным обучениям'
  },
  {
    id: '2',
    formationDate: '13.05.2024',
    type: 'Отчет по текущим заявкам'
  },
  {
    id: '3',
    formationDate: '13.04.2023',
    type: 'Отчет по бюджету на обучение'
  },
  {
    id: '4',
    formationDate: '13.04.2023',
    type: 'Отчет по статусам заявок'
  },
  {
    id: '5',
    formationDate: '13.04.2023',
    type: 'Отчет по эффективности обучений'
  },
  {
    id: '6',
    formationDate: '13.04.2023',
    type: 'Отчет по затратам на обучение'
  },
  {
    id: '7',
    formationDate: '13.04.2023',
    type: 'Отчет по участникам обучений'
  },
  {
    id: '8',
    formationDate: '13.04.2023',
    type: 'Отчет по согласованиям'
  },
  {
    id: '9',
    formationDate: '13.04.2023',
    type: 'Отчет по центрам обучения'
  },
  {
    id: '10',
    formationDate: '13.04.2023',
    type: 'Отчет по направлениям'
  }
]

// Задержка для имитации запроса к серверу
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const reportApi = {
  // Получение всех отчетов
  getReports: async (filters?: Record<string, any>): Promise<Report[]> => {
    try {
      // В реальном приложении используем реальное API
      // const { data } = await api.get('/reports', { params: filters })
      // return data

      // Для тестирования используем мок-данные
      await delay(1000)

      let reports = [...MOCK_REPORTS]

      // Применяем фильтры, если они есть
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== '') {
            reports = reports.filter((report) => {
              const reportValue = report[key as keyof Report]
              if (typeof reportValue === 'string') {
                return reportValue.toLowerCase().includes(value.toLowerCase())
              }
              return reportValue === value
            })
          }
        })
      }

      return reports
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  },

  // Скачивание отчета
  downloadReport: async (id: string): Promise<void> => {
    try {
      // В реальном приложении используем реальное API
      // const response = await api.post('/reports', { id }, { responseType: 'blob' })
      // const url = window.URL.createObjectURL(new Blob([response.data]))
      // const link = document.createElement('a')
      // link.href = url
      // link.setAttribute('download', `report_${id}.pdf`)
      // document.body.appendChild(link)
      // link.click()
      // link.remove()

      // Для демонстрации показываем сообщение
      await delay(1000)
      console.log(`Downloading report ${id}...`)
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  }
}