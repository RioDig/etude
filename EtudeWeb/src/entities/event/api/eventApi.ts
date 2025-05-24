import axios from 'axios'
import { API_URL } from '@/shared/config'
import {
  Application,
  ApplicationDetail,
  ApplicationFilterParam,
  ApplicationStatus,
  ApplicationStatusType,
  ApplicationStatusUpdate,
  ApplicationUpdate
} from '@/shared/types'
import { delay, MOCK_APPLICATION_DETAILS, MOCK_APPLICATIONS } from './mockData'
import { CourseTemplateFilter } from '@/entities/courseTemplate/api/courseTemplateApi.ts'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

/**
 * API для работы с заявками на обучение
 */
export const eventApi = {
  /**
   * Получение списка заявок с возможностью фильтрации
   * @param filters Параметры фильтрации
   */
  getApplications: async (filters?: ApplicationFilterParam[]): Promise<Application[]> => {
    try {
      let filterParams = undefined

      if (filters && Object.keys(filters).length > 0) {
        const filterArray: CourseTemplateFilter[] = Object.entries(filters)
          // @ts-expect-error hotfix
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, value]) => value !== null && value !== undefined && value !== '')
          .map(([key, value]) => ({
            name: key,
            value: typeof value === 'string' ? value : String(value)
          }))

        filterParams = { filter: JSON.stringify(filterArray) }
      }
      const { data } = await api.get<Application[]>('/Application', { params: filterParams })
      return data
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error)

      throw new Error(`Ошибка при получении списка заявок: ${error}`)
    }
  },

  /**
   * Получение детальной информации о заявке по ID
   * @param id Идентификатор заявки
   */
  getApplicationById: async (id: string): Promise<ApplicationDetail> => {
    try {
      const { data } = await api.get<ApplicationDetail>(`/Application/${id}`)
      return data
    } catch (error) {
      console.error(`Ошибка при получении информации о заявке с ID ${id}:`, error)

      await delay(500)

      if (MOCK_APPLICATION_DETAILS[id]) {
        return MOCK_APPLICATION_DETAILS[id]
      }

      const application = MOCK_APPLICATIONS.find((app) => app.application_id === id)
      if (!application) {
        throw new Error(`Заявка с ID ${id} не найдена`)
      }

      return {
        ...application,
        author: {
          id: application.course.course_learner?.id || '0',
          name: application.course.course_learner?.name || 'Unknown',
          surname: application.course.course_learner?.surname || 'User',
          patronymic: application.course.course_learner?.patronymic,
          orgEmail: 'unknown@example.com',
          role: 'user',
          position: application.course.course_learner?.position || '',
          department: application.course.course_learner?.department || '',
          isLeader: application.course.course_learner?.isLeader || false
        },
        approvers: []
      }
    }
  },

  /**
   * Обновление заявки
   * @param id Идентификатор заявки
   * @param data Данные для обновления
   */
  updateApplication: async (id: string, data: ApplicationUpdate): Promise<ApplicationDetail> => {
    try {
      const { data: responseData } = await api.patch<ApplicationDetail>(`/Application/${id}`, data)
      return responseData
    } catch (error) {
      console.error(`Ошибка при обновлении заявки с ID ${id}:`, error)

      await delay(800)

      let applicationDetail = MOCK_APPLICATION_DETAILS[id]
      if (!applicationDetail) {
        const application = MOCK_APPLICATIONS.find((app) => app.application_id === id)
        if (!application) {
          throw new Error(`Заявка с ID ${id} не найдена`)
        }

        applicationDetail = {
          ...application,
          author: {
            id: application.course.course_learner?.id || '0',
            name: application.course.course_learner?.name || 'Unknown',
            surname: application.course.course_learner?.surname || 'User',
            patronymic: application.course.course_learner?.patronymic,
            orgEmail: 'unknown@example.com',
            role: 'user',
            position: application.course.course_learner?.position || '',
            department: application.course.course_learner?.department || '',
            isLeader: application.course.course_learner?.isLeader || false
          },
          approvers: []
        }
      }

      return {
        ...applicationDetail,
        course: {
          ...applicationDetail.course,
          course_name: data.name || applicationDetail.course.course_name,
          course_description: data.description || applicationDetail.course.course_description,
          course_type: data.type || applicationDetail.course.course_type,
          course_track: data.track || applicationDetail.course.course_track,
          course_format: data.format || applicationDetail.course.course_format,
          course_trainingCenter:
            data.trainingCenter || applicationDetail.course.course_trainingCenter,
          course_startDate: data.startDate || applicationDetail.course.course_startDate,
          course_endDate: data.endDate || applicationDetail.course.course_endDate,
          course_link: data.link || applicationDetail.course.course_link,
          course_price: data.price || applicationDetail.course.course_price,
          course_educationGoal: data.educationGoal || applicationDetail.course.course_educationGoal
        }
      }
    }
  },

  /**
   * Изменение статуса заявки
   * @param params Параметры изменения статуса
   */
  changeApplicationStatus: async (params: ApplicationStatusUpdate): Promise<ApplicationDetail> => {
    try {
      const { data } = await api.patch<ApplicationDetail>('/Application/changeStatus', params)
      return data
    } catch (error) {
      console.error(`Ошибка при изменении статуса заявки с ID ${params.id}:`, error)

      await delay(600)

      let applicationDetail = MOCK_APPLICATION_DETAILS[params.id]
      if (!applicationDetail) {
        const applicationIndex = MOCK_APPLICATIONS.findIndex(
          (app) => app.application_id === params.id
        )
        if (applicationIndex === -1) {
          throw new Error(`Заявка с ID ${params.id} не найдена`)
        }

        applicationDetail = {
          ...MOCK_APPLICATIONS[applicationIndex],
          author: {
            id: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.id || '0',
            name: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.name || 'Unknown',
            surname: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.surname || 'User',
            patronymic: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.patronymic,
            orgEmail: 'unknown@example.com',
            role: 'user',
            position: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.position || '',
            department: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.department || '',
            isLeader: MOCK_APPLICATIONS[applicationIndex].course.course_learner?.isLeader || false
          },
          approvers: []
        }
      }

      let newStatus: ApplicationStatus
      switch (params.status) {
        case 'Approvement':
          newStatus = { name: 'Согласовано', type: ApplicationStatusType.Approvement }
          break
        case 'Rejected':
          newStatus = { name: 'Отклонено', type: ApplicationStatusType.Rejected }
          break
        case 'Registered':
          newStatus = { name: 'Выполнено', type: ApplicationStatusType.Registered }
          break
        case 'Processed':
          newStatus = { name: 'В процессе оформления', type: ApplicationStatusType.Processed }
          break
        default:
          newStatus = { name: 'На согласовании', type: ApplicationStatusType.Confirmation }
      }

      return {
        ...applicationDetail,
        status: newStatus,
        comment: params.comment
          ? `${applicationDetail.comment || ''}\n${params.comment}`
          : applicationDetail.comment
      }
    }
  },

  /**
   * Удаление заявки
   * @param id Идентификатор заявки
   */
  deleteApplication: async (id: string): Promise<void> => {
    try {
      await api.delete(`/Application/${id}`)
    } catch (error) {
      console.error(`Ошибка при удалении заявки с ID ${id}:`, error)

      await delay(500)
    }
  },

  downloadICS: async (value: { startDate: Date; endDate: Date }): Promise<Blob> => {
    try {
      const response = await api.post('/Application/downloadICS', value, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error(`Ошибка при скачивании ICS: `, error)
      throw new Error()
    }
  },

  addAttachments: async (params: { id: string; link: string }): Promise<void> => {
    try {
      await api.post('/Application/addAttachments', params)
    } catch (error) {
      console.error(`Ошибка при добавлении ссылки `, error)
      throw new Error()
    }
  }
}
