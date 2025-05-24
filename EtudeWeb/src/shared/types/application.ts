import { User } from '@/shared/types/user.ts'

/**
 * Типы статусов заявок
 */
export enum ApplicationStatusType {
  /**
   * Подтверждение
   */
  Confirmation = 'Confirmation',

  /**
   * Отклонено
   */
  Rejected = 'Rejected',

  /**
   * Утверждено
   */
  Approvement = 'Approvement',

  /**
   * Обработано
   */
  Processed = 'Processed',

  /**
   * Зарегистрировано
   */
  Registered = 'Registered'
}

/**
 * Интерфейс для статуса заявки
 */
export interface ApplicationStatus {
  /**
   * Название статуса
   */
  name: string

  /**
   * Тип статуса
   */
  type: StatusType | string
}

/**
 * Интерфейс для заявки на обучение
 */
export interface Application {
  /**
   * Идентификатор заявки
   */
  application_id: string

  /**
   * Дата создания заявки
   */
  created_at: string

  /**
   * Статус заявки
   */
  status: ApplicationStatus

  attachmentLink?: string

  /**
   * Курс по заявке
   */
  course: Course
}

/**
 * Интерфейс для детальной информации о заявке
 */
export interface ApplicationDetail extends Application {
  /**
   * Комментарий к заявке
   */
  comment?: string

  /**
   * Автор заявки
   */
  author?: User

  /**
   * Согласующие заявки
   */
  approvers?: User[]

  attachmentLink?: string
}

/**
 * Параметр фильтра для запросов заявок
 */
export interface ApplicationFilterParam {
  /**
   * Название фильтра (status, type, format, track, learner)
   */
  name: 'status' | 'type' | 'format' | 'track' | 'learner'

  /**
   * Значение фильтра
   */
  value: string
}

/**
 * Интерфейс для обновления статуса заявки
 */
export interface ApplicationStatusUpdate {
  /**
   * Идентификатор заявки
   */
  id: string

  /**
   * Идентификатор нового статуса
   */
  status: string

  /**
   * Опциональный комментарий
   */
  comment?: string
}

/**
 * Интерфейс для обновления заявки
 */
export interface ApplicationUpdate {
  /**
   * Название
   */
  name?: string

  /**
   * Описание
   */
  description?: string

  /**
   * Тип
   */
  type?: CourseType

  /**
   * Направление
   */
  track?: CourseTrack

  /**
   * Формат
   */
  format?: CourseFormat

  /**
   * Учебный центр
   */
  trainingCenter?: string

  /**
   * Дата начала
   */
  startDate?: string

  /**
   * Дата окончания
   */
  endDate?: string

  /**
   * Ссылка или место проведения
   */
  link?: string

  /**
   * Цена
   */
  price?: string

  /**
   * Цель обучения
   */
  educationGoal?: string

  /**
   * Согласующие
   */
  approvers?: string[]
}

/**
 * Интерфейс для прошедших мероприятий пользователя
 */
export interface PastEvent extends Application {
  // Расширяет интерфейс Application
}

import { Course, CourseFormat, CourseTrack, CourseType } from './course'
import { StatusType } from '@/shared/types/customStatus.ts'
