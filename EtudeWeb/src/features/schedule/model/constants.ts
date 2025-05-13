import { FilterOption } from '@/shared/ui/filter/types'

/**
 * Опции фильтров для расписания
 */
export const scheduleFilterOptions: FilterOption[] = [
  {
    id: 'type',
    label: 'Тип',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все типы' },
      { value: 'Курс', label: 'Курс' },
      { value: 'Конференция', label: 'Конференция' },
      { value: 'Вебинар', label: 'Вебинар' },
      { value: 'Тренинг', label: 'Тренинг' }
    ]
  },
  {
    id: 'format',
    label: 'Формат',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все форматы' },
      { value: 'Онлайн', label: 'Онлайн' },
      { value: 'Очно', label: 'Очно' },
      { value: 'Смешанный', label: 'Смешанный' }
    ]
  },
  {
    id: 'category',
    label: 'Категория',
    type: 'dropdown',
    options: [
      { value: '', label: 'Все категории' },
      { value: 'Hard Skills', label: 'Hard Skills' },
      { value: 'Soft Skills', label: 'Soft Skills' },
      { value: 'Management', label: 'Management' }
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
