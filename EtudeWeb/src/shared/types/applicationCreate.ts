import { CourseType, CourseTrack, CourseFormat } from './course'

/**
 * Интерфейс для создания заявления
 */
export interface ApplicationCreateData {
  name: string
  description?: string
  type: CourseType
  track: CourseTrack
  format: CourseFormat
  trainingCenter?: string
  startDate: string
  endDate: string
  link?: string
  price?: string
  educationGoal?: string
  learner_id: string
  author_id?: string
  approvers?: string[]
}
