/**
 * Тип для роли пользователя
 */
export type UserRole = 'admin' | 'user'

/**
 * Интерфейс для базовой информации о пользователе
 */
export interface UserBase {
  /**
   * Идентификатор пользователя
   */
  id: string

  /**
   * Имя пользователя
   */
  name: string

  /**
   * Фамилия пользователя
   */
  surname: string

  /**
   * Отчество пользователя
   */
  patronymic?: string
}

/**
 * Интерфейс для расширенной информации о пользователе
 */
export interface User extends UserBase {
  /**
   * Корпоративная почта пользователя
   */
  orgEmail: string

  /**
   * Роль пользователя
   */
  role: UserRole

  /**
   * Должность пользователя
   */
  position?: string

  /**
   * Подразделение пользователя
   */
  department?: string

  /**
   * Является ли пользователь руководителем
   */
  isLeader?: boolean
}
