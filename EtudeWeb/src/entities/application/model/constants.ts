/**
 * Типы мероприятий
 */
export const EVENT_TYPES = {
  conference: 'Конференция',
  course: 'Курс',
  webinar: 'Вебинар',
  training: 'Тренинг'
}

/**
 * Категории мероприятий
 */
export const EVENT_CATEGORIES = {
  'hard-skills': 'Hard Skills',
  'soft-skills': 'Soft Skills',
  management: 'Management'
}

/**
 * Форматы мероприятий
 */
export const EVENT_FORMATS = {
  offline: 'Очно',
  online: 'Онлайн',
  mixed: 'Смешанный'
}

/**
 * Статусы заявлений
 */
export const APPLICATION_STATUSES = {
  draft: 'Черновик',
  pending: 'На рассмотрении',
  approved: 'Одобрено',
  rejected: 'Отклонено'
}

/**
 * Преобразование типа мероприятия в читаемую форму
 */
export const getReadableEventType = (type: string): string => {
  return EVENT_TYPES[type as keyof typeof EVENT_TYPES] || type
}

/**
 * Преобразование категории мероприятия в читаемую форму
 */
export const getReadableEventCategory = (category: string): string => {
  return EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || category
}

/**
 * Преобразование формата мероприятия в читаемую форму
 */
export const getReadableEventFormat = (format: string): string => {
  return EVENT_FORMATS[format as keyof typeof EVENT_FORMATS] || format
}

/**
 * Преобразование статуса заявления в читаемую форму
 */
export const getReadableApplicationStatus = (status: string): string => {
  return APPLICATION_STATUSES[status as keyof typeof APPLICATION_STATUSES] || status
}
