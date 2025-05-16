import { useQuery } from '@tanstack/react-query'
import { applicationApi } from '../api/applicationApi'
import { usePageFilters } from '@/entities/filter'

/**
 * Хук для получения данных каталога мероприятий с учетом фильтрации
 */
export const useApplicationCatalog = () => {
  const { filters } = usePageFilters('application-catalog')

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
    queryKey: ['applications', 'catalog', filters],
    queryFn: () => applicationApi.getEventsCatalog(apiFilters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })
}

/**
 * Хук для получения данных конкретного мероприятия по ID
 */
export const useApplicationEvent = (eventId: string | null) => {
  return useQuery({
    queryKey: ['applications', 'event', eventId],
    queryFn: () => applicationApi.getEventById(eventId as string),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })
}

/**
 * Хук для создания или обновления заявления
 * (Можно использовать useMutation из React Query)
 */
