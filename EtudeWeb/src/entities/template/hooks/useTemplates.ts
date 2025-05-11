import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templateApi } from '../api/templateApi'
import { usePageFilters } from '@/entities/filter'

export const useTemplates = () => {
  const { filters } = usePageFilters('admin-templates')

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
    queryKey: ['templates', apiFilters],
    queryFn: () => templateApi.getTemplates(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      templateApi.updateTemplate(id, data),
    onSuccess: () => {
      // Инвалидируем кэш списка шаблонов
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateApi.deleteTemplate(id),
    onSuccess: () => {
      // Инвалидируем кэш списка шаблонов
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    }
  })
}