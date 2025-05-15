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
  type: ApplicationStatusType | string
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

  /**
   * Курс по заявке
   */
  course: Course
}

/**
 * Интерфейс для прошедших мероприятий пользователя
 */
export interface PastEvent extends Application {
  // Расширяет интерфейс Application
}

import { Course } from './course'
