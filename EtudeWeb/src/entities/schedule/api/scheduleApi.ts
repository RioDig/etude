import axios from 'axios'
import { API_URL } from '@/shared/config'
import { CourseTemplate, CourseTemplateFilterParam } from '@/shared/types'
import { MOCK_SCHEDULE_TEMPLATES } from './mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const scheduleApi = {
  /**
   * Получение всех мероприятий для расписания
   * @param filters Параметры фильтрации
   */
  getSchedule: async (filters?: CourseTemplateFilterParam[]): Promise<CourseTemplate[]> => {
    try {
      const apiFilters: CourseTemplateFilterParam[] = filters
        ? Object.entries(filters)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => ({
              name: key as 'name' | 'type' | 'format' | 'track',
              value: String(value)
            }))
        : []

      const { data } = await api.get<CourseTemplate[]>('/CourseTemplate', {
        params: apiFilters.length ? { filter: JSON.stringify(apiFilters) } : undefined
      })

      return data.filter(
        (template) => template.course_template_startDate && template.course_template_endDate
      )
    } catch (error) {
      console.error('Error fetching schedule:', error)

      await new Promise((resolve) => setTimeout(resolve, 800))
      return MOCK_SCHEDULE_TEMPLATES.filter(
        (template) => template.course_template_startDate && template.course_template_endDate
      )
    }
  },

  /**
   * Получение конкретного шаблона по ID
   * @param id ID шаблона
   */
  getScheduleTemplateById: async (id: string): Promise<CourseTemplate> => {
    try {
      const { data } = await api.get<CourseTemplate>(`/CourseTemplate/${id}`)
      return data
    } catch (error) {
      console.error(`Error fetching schedule template with id ${id}:`, error)

      await new Promise((resolve) => setTimeout(resolve, 500))
      const template = MOCK_SCHEDULE_TEMPLATES.find((t) => t.course_template_id === id)
      if (!template) {
        throw new Error(`Schedule template with id ${id} not found`)
      }
      return template
    }
  }
}
