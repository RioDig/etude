import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { statusApi } from '../api/statusApi'
import { usePageFilters } from '@/entities/filter'

export const useStatuses = () => {
  const { filters } = usePageFilters('admin-statuses')

  // Преобразуем фильтры в формат, подходящий для API
  const apiFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  return useQuery({
    queryKey: ['statuses', apiFilters],
    queryFn: () => statusApi.getStatuses(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

export const useUpdateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      statusApi.updateStatus(id, data),
    onSuccess: () => {
      // Инвалидируем кэш списка статусов
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
    }
  })
}

export const useDeleteStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => statusApi.deleteStatus(id),
    onSuccess: () => {
      // Инвалидируем кэш списка статусов
      queryClient.invalidateQueries({ queryKey: ['statuses'] })
    }
  })
}