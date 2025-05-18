import { FilterOption } from '@/shared/ui/filter/types'

/**
 * Опции фильтров для расписания
 */
export const scheduleFilterOptions: FilterOption[] = [
  {
    id: 'name',
    label: 'Наименование',
    type: 'dropdown',
    options: [{ value: '', label: 'Все курсы' }]
  },
  {
    id: 'type',
    label: 'Тип',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все типы' },
      { value: 'Course', label: 'Курс' },
      { value: 'Conference', label: 'Конференция' },
      { value: 'Certification', label: 'Сертификация' },
      { value: 'Workshop', label: 'Мастер-класс' }
    ]
  },
  {
    id: 'format',
    label: 'Формат',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все форматы' },
      { value: 'Online', label: 'Онлайн' },
      { value: 'Offline', label: 'Очно' }
    ]
  },
  {
    id: 'track',
    label: 'Направление',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все направления' },
      { value: 'HardSkills', label: 'Hard Skills' },
      { value: 'SoftSkills', label: 'Soft Skills' },
      { value: 'ManagementSkills', label: 'Management Skills' }
    ]
  }
]

/**
 * Опции для переключателя режима календаря
 */
export const calendarViewOptions = [
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' }
]
