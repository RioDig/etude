import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface Employee {
  id: string
  name: string
  surname: string
  patronymic?: string
  position?: string
  department?: string
  isLeader?: boolean
}

export interface EmployeeAutocompleteResponse {
  employees: Employee[]
  hasMoreItems: boolean
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Иван',
    surname: 'Иванов',
    patronymic: 'Иванович',
    position: 'Старший разработчик',
    department: 'ИТ-отдел',
    isLeader: false
  },
  {
    id: '2',
    name: 'Петр',
    surname: 'Петров',
    patronymic: 'Петрович',
    position: 'Руководитель отдела разработки',
    department: 'ИТ-отдел',
    isLeader: true
  },
  {
    id: '3',
    name: 'Елена',
    surname: 'Сидорова',
    patronymic: 'Викторовна',
    position: 'HR-директор',
    department: 'HR',
    isLeader: true
  },
  {
    id: '4',
    name: 'Алексей',
    surname: 'Смирнов',
    patronymic: 'Дмитриевич',
    position: 'Технический директор',
    department: 'Руководство',
    isLeader: true
  }
]

export const employeeAutocompleteApi = {
  /**
   * Получение данных автокомплита сотрудников
   * @param term Строка для поиска
   * @param idsToRemove Массив ID для исключения из результатов
   */
  getEmployees: async (
    term?: string,
    idsToRemove: string[] = []
  ): Promise<EmployeeAutocompleteResponse> => {
    try {
      const { data } = await axios.get<EmployeeAutocompleteResponse>(
        `${API_URL}/Autocomplete/employee1`,
        {
          params: {
            term,
            idsToRemove: idsToRemove?.join(',')
          },
          withCredentials: true
        }
      )

      return data
    } catch (error) {
      console.error('Error fetching employee autocomplete data:', error)

      await delay(500)

      let filteredEmployees = [...MOCK_EMPLOYEES]

      if (term) {
        const searchTerm = term.toLowerCase()
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.surname.toLowerCase().includes(searchTerm) ||
            (emp.patronymic && emp.patronymic.toLowerCase().includes(searchTerm)) ||
            (emp.position && emp.position.toLowerCase().includes(searchTerm))
        )
      }

      if (idsToRemove && idsToRemove.length > 0) {
        filteredEmployees = filteredEmployees.filter((emp) => !idsToRemove.includes(emp.id))
      }

      return {
        employees: filteredEmployees.slice(0, 8),
        hasMoreItems: filteredEmployees.length > 8
      }
    }
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
