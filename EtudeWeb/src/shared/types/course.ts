/**
 * Типы форматов курса
 */
export enum CourseFormat {
  /**
   * Очное обучение
   */
  Offline = 'Offline',

  /**
   * Онлайн обучение
   */
  Online = 'Online'
}

/**
 * Типы курсов
 */
export enum CourseType {
  /**
   * Курс
   */
  Course = 'Course',

  /**
   * Конференция
   */
  Conference = 'Conference',

  /**
   * Сертификация
   */
  Certification = 'Certification',

  /**
   * Мастер-класс
   */
  Workshop = 'Workshop'
}

/**
 * Направления курсов
 */
export enum CourseTrack {
  /**
   * Профессиональные навыки
   */
  HardSkills = 'HardSkills',

  /**
   * Гибкие навыки
   */
  SoftSkills = 'SoftSkills',

  /**
   * Управленческие навыки
   */
  ManagementSkills = 'ManagementSkills'
}

/**
 * Интерфейс для обучающегося
 */
export interface CourseLearner {
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

  /**
   * Должность пользователя
   */
  position?: string

  /**
   * Подразделение пользователя
   */
  department?: string

  /**
   * Является ли руководителем
   */
  isLeader?: boolean
}

/**
 * Интерфейс для курса
 */
export interface Course {
  /**
   * Идентификатор курса
   */
  course_id: string

  /**
   * Название курса
   */
  course_name: string

  /**
   * Описание курса
   */
  course_description?: string

  /**
   * Тип курса
   */
  course_type: CourseType

  /**
   * Направление курса
   */
  course_track: CourseTrack

  /**
   * Формат курса
   */
  course_format: CourseFormat

  /**
   * Учебный центр
   */
  course_trainingCenter?: string

  /**
   * Дата начала курса
   */
  course_startDate: string

  /**
   * Дата окончания курса
   */
  course_endDate: string

  /**
   * Ссылка на курс или место проведения
   */
  course_link?: string

  /**
   * Цена курса
   */
  course_price?: string | number

  /**
   * Цель обучения
   */
  course_educationGoal?: string

  /**
   * Обучающийся
   */
  course_learner?: CourseLearner
}
