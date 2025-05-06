import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '../api/eventApi'
import { usePageFilters } from '@/entities/filter'
import { Event } from '../model/types'

/**
 * Хук для получения списка мероприятий с учетом фильтров
 */
export const useEvents = () => {
  const { filters } = usePageFilters('events-page')

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

  // Используем API напрямую, без дублирования моков
  return useQuery({
    queryKey: ['events', apiFilters],
    queryFn: () => eventApi.getEvents(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

/**
 * Хук для получения детальной информации о мероприятии
 */
export const useEventDetails = (id?: string, options = {}) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEventById(id!),
    enabled: !!id,
    ...options
  })
}

/**
 * Хук для создания нового мероприятия
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventData: Partial<Event>) => eventApi.createEvent(eventData),
    onSuccess: () => {
      // Инвалидируем кэш списка мероприятий для обновления данных
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

/**
 * Хук для обновления существующего мероприятия
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventApi.updateEvent(id, data),
    onSuccess: (data) => {
      // Инвалидируем кэш для этого конкретного мероприятия и списка
      queryClient.invalidateQueries({ queryKey: ['event', data.id] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

/**
 * Хук для изменения статуса мероприятия
 */
export const useChangeEventStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason
    }: {
      id: string
      status: 'approved' | 'rejected' | 'completed'
      reason?: string
    }) => {
      if (status === 'approved') {
        return eventApi.approveEvent(id)
      } else if (status === 'rejected') {
        return eventApi.rejectEvent(id, reason || '')
      } else {
        // Для статуса 'completed' можно добавить отдельный метод в API
        // или использовать обновление
        return eventApi.updateEvent(id, { status })
      }
    },
    onSuccess: (data) => {
      // Инвалидируем кэш для этого конкретного мероприятия и списка
      queryClient.invalidateQueries({ queryKey: ['event', data.id] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}
