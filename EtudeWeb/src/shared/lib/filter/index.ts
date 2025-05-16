import { useFiltersStore } from '@/entities/filter'
import { FilterValue } from '@/entities/filter'

export type FilterOptions = {
  pageId: string
  filterId: string
  value: FilterValue
}

export const filterApi = {
  /**
   * Установка значения фильтра
   */
  setFilter: ({ pageId, filterId, value }: FilterOptions) => {
    useFiltersStore.getState().setFilter(pageId, filterId, value)
  },

  /**
   * Сброс всех фильтров для конкретной страницы
   */
  resetFilters: (pageId: string) => {
    useFiltersStore.getState().resetFilters(pageId)
  },

  /**
   * Сброс всех фильтров для всех страниц
   */
  resetAllFilters: () => {
    useFiltersStore.getState().resetAllFilters()
  },

  /**
   * Получение значения конкретного фильтра
   */
  getFilterValue: (pageId: string, filterId: string): FilterValue => {
    const state = useFiltersStore.getState()
    return state.filters[pageId]?.[filterId] || null
  },

  /**
   * Получение всех фильтров для конкретной страницы
   */
  getPageFilters: (pageId: string) => {
    const state = useFiltersStore.getState()
    return state.filters[pageId] || {}
  }
}
