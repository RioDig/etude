import { useQuery } from '@tanstack/react-query'
import { applicationApi } from '../api/applicationApi'
import { usePageFilters } from '@/entities/filter'

/**
 * Хук для получения данных каталога мероприятий с учетом фильтрации
 */
export const useApplicationCatalog = () => {
  // Получаем фильтры из хранилища
  const { filters } = usePageFilters('application-catalog')

  // Преобразуем фильтры в формат, подходящий для API
  const apiFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      // Игнорируем пустые значения
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  // Запрос на получение каталога с учетом фильтров
  return useQuery({
    queryKey: ['applications', 'catalog', filters],
    queryFn: () => applicationApi.getEventsCatalog(apiFilters),
    staleTime: 1000 * 60 * 5, // Данные считаются свежими 5 минут
    refetchOnWindowFocus: false // Не обновлять данные при фокусе окна
  })
}

/**
 * Хук для получения данных конкретного мероприятия по ID
 */
export const useApplicationEvent = (eventId: string | null) => {
  return useQuery({
    queryKey: ['applications', 'event', eventId],
    queryFn: () => applicationApi.getEventById(eventId as string),
    enabled: !!eventId, // Запрос активен только если есть eventId
    staleTime: 1000 * 60 * 5, // Данные считаются свежими 5 минут
    refetchOnWindowFocus: false // Не обновлять данные при фокусе окна
  })
}

/**
 * Хук для создания или обновления заявления
 * (Можно использовать useMutation из React Query)
 */
