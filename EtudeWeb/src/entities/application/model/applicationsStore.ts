import { create } from 'zustand';
import { ApplicationsStore } from './types';

export const useApplicationsStore = create<ApplicationsStore>((set) => ({
  filters: {
    status: null,
    dateRange: [null, null],
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () =>
    set({
      filters: {
        status: null,
        dateRange: [null, null],
      },
    }),
}));