import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type FilterValue = string | Date | null

export interface FilterState {
  [filterId: string]: FilterValue
}

export interface FiltersStore {
  filters: {
    [pageId: string]: FilterState
  }

  setFilter: (pageId: string, filterId: string, value: FilterValue) => void
  resetFilters: (pageId: string) => void
  resetAllFilters: () => void
}

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      filters: {},

      setFilter: (pageId, filterId, value) =>
        set((state) => {
          const newFilters = { ...state.filters }
          if (!newFilters[pageId]) {
            newFilters[pageId] = {}
          }

          newFilters[pageId] = {
            ...newFilters[pageId],
            [filterId]: value
          }

          return { filters: newFilters }
        }),

      resetFilters: (pageId) =>
        set((state) => {
          const newFilters = { ...state.filters }
          newFilters[pageId] = {}
          return { filters: newFilters }
        }),

      resetAllFilters: () => set({ filters: {} })
    }),
    { name: 'filters-store' }
  )
)

export const usePageFilters = (pageId: string) => {
  const allFilters = useFiltersStore((state) => state.filters)
  const setFilter = useFiltersStore((state) => state.setFilter)
  const resetFilters = useFiltersStore((state) => state.resetFilters)

  const pageFilters = allFilters[pageId] || {}

  const setPageFilter = (filterId: string, value: FilterValue) => {
    setFilter(pageId, filterId, value)
  }

  const resetPageFilters = () => {
    resetFilters(pageId)
  }

  return {
    filters: pageFilters,
    setFilter: setPageFilter,
    resetFilters: resetPageFilters
  }
}
