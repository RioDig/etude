import axios from 'axios'
import { API_URL } from '@/shared/config'

export interface Employee {
  id: string
  name: string
  position: string
  department: string
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    position: 'Руководитель группы разработки',
    department: 'Разработка'
  },
  {
    id: '2',
    name: 'Петров Петр Петрович',
    position: 'Старший разработчик',
    department: 'Разработка'
  },
  { id: '3', name: 'Сидорова Елена Викторовна', position: 'HR-менеджер', department: 'HR' },
  { id: '4', name: 'Козлов Алексей Сергеевич', position: 'Дизайнер', department: 'Дизайн' },
  {
    id: '5',
    name: 'Михайлов Михаил Михайлович',
    position: 'Технический директор',
    department: 'Руководство'
  }
]

export const employeeApi = {
  getEmployees: async (excludeIds: string[] = []): Promise<Employee[]> => {
    try {
      // const { data } = await api.get('/employee', { params: { excludeIds } });

      await new Promise((resolve) => setTimeout(resolve, 500))

      return MOCK_EMPLOYEES.filter((emp) => !excludeIds.includes(emp.id))
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    try {
      // const { data } = await api.get(`/employee/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 300))

      const employee = MOCK_EMPLOYEES.find((emp) => emp.id === id)
      if (!employee) {
        throw new Error(`Employee with id ${id} not found`)
      }

      return employee
    } catch (error) {
      console.error(`Error fetching employee with id ${id}:`, error)
      throw error
    }
  }
}
