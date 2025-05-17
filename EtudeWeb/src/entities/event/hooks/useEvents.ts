import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '../api/eventApi'
import { usePageFilters } from '@/entities/filter'
import { ApplicationStatusUpdate, ApplicationUpdate } from '@/shared/types'

/**
 * Хук для получения списка заявок с учетом фильтров
 */
export const useApplications = () => {
  // Получаем фильтры из хранилища Zustand
  const { filters } = usePageFilters('events-page')

  // Преобразуем фильтры в массив для API
  const apiFilters = Object.entries(filters).reduce(
    (result, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = String(value)
      }
      return result
    },
    {} as Record<string, string>
  )

  return useQuery({
    queryKey: ['applications', apiFilters],
    // @ts-expect-error hotfix
    queryFn: () => eventApi.getApplications(apiFilters),
    staleTime: 1000 * 60 * 5, // Данные считаются свежими 5 минут
    refetchOnWindowFocus: true
  })
}

/**
 * Хук для получения детальной информации о заявке
 */
export const useApplicationDetail = (id?: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => eventApi.getApplicationById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  })
}

/**
 * Хук для обновления заявки
 */
export const useUpdateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplicationUpdate }) =>
      eventApi.updateApplication(id, data),
    onSuccess: (_data, variables) => {
      // Инвалидируем запросы для обновления данных в UI
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    }
  })
}

/**
 * Хук для изменения статуса заявки
 */
export const useChangeApplicationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ApplicationStatusUpdate) => eventApi.changeApplicationStatus(params),
    onSuccess: (_data, variables) => {
      // Инвалидируем запросы для обновления данных в UI
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    }
  })
}

/**
 * Хук для удаления заявки
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventApi.deleteApplication(id),
    onSuccess: (_, id) => {
      // Инвалидируем запросы для обновления данных в UI
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      // Удаляем детали заявки из кэша
      queryClient.removeQueries({ queryKey: ['application', id] })
    }
  })
}
