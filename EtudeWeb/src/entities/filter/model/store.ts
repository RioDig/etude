import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Типы для фильтров
export type FilterValue = string | Date | null;

export interface FilterState {
  [filterId: string]: FilterValue;
}

// Интерфейс для хранилища фильтров
export interface FiltersStore {
  // Состояния фильтров для разных страниц
  filters: {
    [pageId: string]: FilterState;
  };

  // Действия
  setFilter: (pageId: string, filterId: string, value: FilterValue) => void;
  resetFilters: (pageId: string) => void;
  resetAllFilters: () => void;
}

// Создаем хранилище
export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      filters: {},

      // Установка значения фильтра
      setFilter: (pageId, filterId, value) =>
        set((state) => {
          const newFilters = { ...state.filters };
          if (!newFilters[pageId]) {
            newFilters[pageId] = {};
          }

          newFilters[pageId] = {
            ...newFilters[pageId],
            [filterId]: value
          };

          return { filters: newFilters };
        }),

      // Сброс всех фильтров для конкретной страницы
      resetFilters: (pageId) =>
        set((state) => {
          const newFilters = { ...state.filters };
          newFilters[pageId] = {};
          return { filters: newFilters };
        }),

      // Сброс всех фильтров
      resetAllFilters: () =>
        set({ filters: {} })
    }),
    { name: 'filters-store' }
  )
);

// Упрощенный хук для использования фильтров на странице
export const usePageFilters = (pageId: string) => {
  // Получаем всё состояние фильтров из стора
  const allFilters = useFiltersStore(state => state.filters);
  const setFilter = useFiltersStore(state => state.setFilter);
  const resetFilters = useFiltersStore(state => state.resetFilters);

  // Получаем фильтры для конкретной страницы
  const pageFilters = allFilters[pageId] || {};

  // Создаем обертки для функций
  const setPageFilter = (filterId: string, value: FilterValue) => {
    setFilter(pageId, filterId, value);
  };

  const resetPageFilters = () => {
    resetFilters(pageId);
  };

  return {
    filters: pageFilters,
    setFilter: setPageFilter,
    resetFilters: resetPageFilters
  };
};