/**
 * Типы для статуса мероприятия
 */
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'completed'

/**
 * Типы для типа мероприятия
 */
export type EventType = 'conference' | 'course' | 'webinar' | 'training'

/**
 * Типы для формата мероприятия
 */
export type EventFormat = 'offline' | 'online' | 'mixed'

/**
 * Типы для категории мероприятия
 */
export type EventCategory = 'hard-skills' | 'soft-skills' | 'management'

/**
 * Интерфейс для участника мероприятия
 */
export interface Participant {
  id: string
  name: string
  position?: string
  department?: string
}

/**
 * Интерфейс для согласующего мероприятия
 */
export interface Approver {
  id: string
  name: string
  position?: string
  approved: boolean
  approvedAt?: string
}

/**
 * Базовый интерфейс для мероприятия
 */
export interface Event {
  id: string
  title: string
  description?: string
  type: EventType
  format: EventFormat
  category: EventCategory
  status: EventStatus
  startDate: string | Date
  endDate: string | Date
  createdAt: string
  updatedAt: string
  employee?: string
}

/**
 * Интерфейс для детальной информации о мероприятии
 */
export interface EventDetails extends Event {
  location?: string
  participants?: Participant[]
  approvers?: Approver[]
  cost?: string
  goal?: string
  comments?: string
  documents?: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
}
