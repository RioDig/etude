import { CourseFormat } from '@/shared/types'

export const CourseFormatLabels: Record<CourseFormat, string> = {
  [CourseFormat.Offline]: 'Очно',
  [CourseFormat.Online]: 'Онлайн'
}
