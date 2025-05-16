import { CourseFormat, CourseTrack, CourseType } from '@/shared/types/course.ts'

/**
 * Интерфейс для шаблона курса
 */
export interface CourseTemplate {
  /**
   * Идентификатор шаблона курса
   */
  course_template_id: string

  /**
   * Название шаблона курса
   */
  course_template_name: string

  /**
   * Описание шаблона курса
   */
  course_template_description?: string

  /**
   * Тип курса (course, conference, certification, workshop)
   */
  course_template_type: CourseType

  /**
   * Направление курса (Soft Skills, Hard Skills, Management Skills)
   */
  course_template_track: CourseTrack

  /**
   * Формат проведения (очно, дистанционно)
   */
  course_template_format: CourseFormat

  /**
   * Учебный центр
   */
  course_template_trainingCenter?: string

  /**
   * Дата начала
   */
  course_template_startDate?: string

  /**
   * Дата окончания
   */
  course_template_endDate?: string

  /**
   * Ссылка или место проведения
   */
  course_template_link?: string
}

/**
 * Параметр фильтра для запросов шаблонов курсов
 */
export interface CourseTemplateFilterParam {
  /**
   * Название фильтра (name, type, format, track)
   */
  name: 'name' | 'type' | 'format' | 'track'

  /**
   * Значение фильтра
   */
  value: string
}
