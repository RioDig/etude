import { FilterValue } from '@/entities/filter'

export interface FilterDropdownOption {
  value: string
  label: string
}

export type FilterType = 'dropdown' | 'date'

export interface FilterOption {
  id: string
  label: string
  type: FilterType
  defaultValue?: string
  options?: FilterDropdownOption[]
}

export interface FilterProps {
  /**
   * Список опций фильтров
   */
  filters: FilterOption[]

  /**
   * ID страницы/компонента для сохранения состояния
   */
  pageId: string

  /**
   * Обработчик изменения фильтра
   */
  onChange?: (filterId: string, value: FilterValue) => void

  /**
   * Обработчик сброса фильтров
   */
  onReset?: () => void

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}
