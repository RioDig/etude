import { CourseType } from '../types'

export const CourseTypeLabels: Record<CourseType, string> = {
  [CourseType.Course]: 'Курс',
  [CourseType.Conference]: 'Конференция',
  [CourseType.Certification]: 'Сертификация',
  [CourseType.Workshop]: 'Мастер-класс'
}
