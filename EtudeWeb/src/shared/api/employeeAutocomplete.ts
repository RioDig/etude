import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface Employee {
  id: string
  name: string
  position?: string
  department?: string
}

export interface EmployeeAutocompleteResponse {
  employees: Employee[]
  hasMoreItems: boolean
}

export const employeeAutocompleteApi = {
  /**
   * Получение данных автокомплита сотрудников
   * @param term Строка для поиска
   * @param idsToRemove Массив ID для исключения из результатов
   */
  getEmployees: async (
    term?: string,
    idsToRemove?: string[]
  ): Promise<EmployeeAutocompleteResponse> => {
    try {
      const { data } = await axios.get(`${API_URL}/autocomplete/employee`, {
        params: {
          term,
          idsToRemove: idsToRemove?.join(',')
        },
        withCredentials: true
      })

      return data
    } catch (error) {
      console.error('Error fetching employee autocomplete data:', error)

      return { employees: [], hasMoreItems: false }
    }
  }
}
