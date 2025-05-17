export enum StatusType {
  Confirmation = 'Confirmation',
  Rejected = 'Rejected',
  Approvement = 'Approvement',
  Processed = 'Processed', // Собирательный статус
  Registered = 'Registered',
}

/**
 * Интерфейс для дополнительного статуса
 */
export interface CustomStatus {
  /**
   * Идентификатор статуса
   */
  id: string

  /**
   * Название статуса
   */
  name: string

  /**
   * Тип статуса
   */
  type?: StatusType

  /**
   * Описание статуса
   */
  description: string
  isProtected: boolean
}
