import axios from 'axios'
import { API_URL } from '@/shared/config'
import { CourseTemplate, CourseTemplateFilterParam } from '@/shared/types'
import { delay, MOCK_COURSE_TEMPLATES } from './mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export interface CourseTemplateFilter {
  name: string
  value: string
}

export const courseTemplateApi = {
  /**
   * Получение списка шаблонов курсов с возможностью фильтрации
   */
  getCourseTemplates: async (filters?: CourseTemplateFilterParam[]): Promise<CourseTemplate[]> => {
    try {
      let filterParams = undefined

      if (filters && Object.keys(filters).length > 0) {
        const filterArray: CourseTemplateFilter[] = Object.entries(filters)
          .filter(([_, value]) => value !== null && value !== undefined && value !== '')
          .map(([key, value]) => ({
            name: key,
            value: typeof value === 'string' ? value : String(value)
          }))

        filterParams = { filter: JSON.stringify(filterArray) }
      }

      const { data } = await api.get<CourseTemplate[]>('/CourseTemplate', {
        params: filterParams
      })

      return data
    } catch (error) {
      console.error('Error fetching course templates:', error)
      await delay(800)

      if (filters && filters.length > 0) {
        return MOCK_COURSE_TEMPLATES.filter((template) => {
          return filters.every((filter) => {
            switch (filter.name) {
              case 'name':
                return template.course_template_name
                  .toLowerCase()
                  .includes(filter.value.toLowerCase())
              case 'type':
                return template.course_template_type === filter.value
              case 'format':
                return template.course_template_format === filter.value
              case 'track':
                return template.course_template_track === filter.value
              default:
                return true
            }
          })
        })
      }

      return MOCK_COURSE_TEMPLATES
    }
  },

  /**
   * Получение шаблона курса по ID
   */
  getCourseTemplateById: async (id: string): Promise<CourseTemplate> => {
    try {
      const { data } = await api.get<CourseTemplate>(`/CourseTemplate/${id}`)
      return data
    } catch (error) {
      console.error(`Error fetching course template with id ${id}:`, error)

      await delay(500)
      const template = MOCK_COURSE_TEMPLATES.find((t) => t.course_template_id === id)
      if (!template) {
        throw new Error(`Course template with id ${id} not found`)
      }
      return template
    }
  },

  /**
   * Создание нового шаблона курса
   */
  createCourseTemplate: async (
    templateData: Omit<CourseTemplate, 'course_template_id'>
  ): Promise<CourseTemplate> => {
    try {
      const { data } = await api.post<CourseTemplate>('/CourseTemplate', templateData)
      return data
    } catch (error) {
      console.error('Error creating course template:', error)

      await delay(1000)
      return {
        course_template_id: String(Date.now()),
        ...templateData
      }
    }
  },

  /**
   * Обновление шаблона курса
   */
  updateCourseTemplate: async (templateData: CourseTemplate): Promise<CourseTemplate> => {
    try {
      const { data } = await api.patch<CourseTemplate>('/CourseTemplate', templateData)
      return data
    } catch (error) {
      console.error(
        `Error updating course template with id ${templateData.course_template_id}:`,
        error
      )
      await delay(800)
      return templateData
    }
  },

  /**
   * Удаление шаблона курса
   */
  deleteCourseTemplate: async (id: string): Promise<void> => {
    try {
      await api.delete(`/CourseTemplate/${id}`)
    } catch (error) {
      console.error(`Error deleting course template with id ${id}:`, error)
      await delay(600)
    }
  }
}
