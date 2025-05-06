import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '../api/eventApi'
import { usePageFilters } from '@/entities/filter'
import { Event } from '../model/types'
import { MOCK_EVENTS, MOCK_EVENT_DETAILS, delay, filterEvents } from '../api/mocks'

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

  // В реальном приложении используем API
  // return useQuery({
  //   queryKey: ['events', apiFilters],
  //   queryFn: () => eventApi.getEvents(apiFilters),
  //   staleTime: 1000 * 60 * 5, // Данные считаются свежими 5 минут
  // });

  // Для тестов используем мок-данные
  return useQuery({
    queryKey: ['events', apiFilters],
    queryFn: async () => {
      // Имитация задержки запроса
      await delay(1000)
      // Фильтрация данных
      return filterEvents(MOCK_EVENTS, apiFilters)
    },
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

/**
 * Хук для получения детальной информации о мероприятии
 */
export const useEventDetails = (id?: string, options = {}) => {
  // В реальном приложении используем API
  // return useQuery({
  //   queryKey: ['event', id],
  //   queryFn: () => eventApi.getEventById(id!),
  //   enabled: !!id,
  //   ...options
  // });

  // Для тестов используем мок-данные
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      // Имитация задержки запроса
      await delay(800)
      // Проверяем, есть ли детальная информация для этого мероприятия
      if (id && MOCK_EVENT_DETAILS[id]) {
        return MOCK_EVENT_DETAILS[id]
      }
      // Если нет детальных данных, находим базовое мероприятие
      const event = MOCK_EVENTS.find((e) => e.id === id)
      if (!event) {
        throw new Error(`Event with id ${id} not found`)
      }
      return {
        ...event,
        // Добавляем пустые поля для детальной информации
        location: undefined,
        participants: [],
        approvers: [],
        cost: undefined,
        goal: undefined,
        comments: undefined,
        documents: []
      }
    },
    enabled: !!id,
    ...options
  })
}

/**
 * Хук для создания нового мероприятия
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  // В реальном приложении используем API
  // return useMutation({
  //   mutationFn: (eventData: Partial<Event>) => eventApi.createEvent(eventData),
  //   onSuccess: () => {
  //     // Инвалидируем кэш списка мероприятий для обновления данных
  //     queryClient.invalidateQueries({ queryKey: ['events'] });
  //   }
  // });

  // Для тестов используем мок-данные
  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      // Имитация задержки запроса
      await delay(1500)

      // Создаем новое мероприятие с генерацией ID и дат
      const newEvent: Event = {
        id: `${Math.floor(Math.random() * 1000)}`,
        title: eventData.title || '',
        description: eventData.description,
        type: eventData.type || 'course',
        format: eventData.format || 'online',
        category: eventData.category || 'hard-skills',
        status: 'pending',
        startDate: eventData.startDate || new Date().toISOString(),
        endDate: eventData.endDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employee: eventData.employee
      }

      return newEvent
    },
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

  // В реальном приложении используем API
  // return useMutation({
  //   mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
  //     eventApi.updateEvent(id, data),
  //   onSuccess: (data) => {
  //     // Инвалидируем кэш для этого конкретного мероприятия и списка
  //     queryClient.invalidateQueries({ queryKey: ['event', data.id] });
  //     queryClient.invalidateQueries({ queryKey: ['events'] });
  //   }
  // });

  // Для тестов используем мок-данные
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      // Имитация задержки запроса
      await delay(1500)

      // Находим мероприятие в моках
      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Event with id ${id} not found`)
      }

      // Обновляем мероприятие
      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }

      return updatedEvent
    },
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

  // В реальном приложении используем API
  // return useMutation({
  //   mutationFn: ({ id, status, reason }: { id: string; status: 'approved' | 'rejected'; reason?: string }) => {
  //     if (status === 'approved') {
  //       return eventApi.approveEvent(id);
  //     } else {
  //       return eventApi.rejectEvent(id, reason || '');
  //     }
  //   },
  //   onSuccess: (data) => {
  //     // Инвалидируем кэш для этого конкретного мероприятия и списка
  //     queryClient.invalidateQueries({ queryKey: ['event', data.id] });
  //     queryClient.invalidateQueries({ queryKey: ['events'] });
  //   }
  // });

  // Для тестов используем мок-данные
  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason
    }: {
      id: string
      status: 'approved' | 'rejected' | 'completed'
      reason?: string
    }) => {
      // Имитация задержки запроса
      await delay(1000)

      // Находим мероприятие в моках
      const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === id)
      if (eventIndex === -1) {
        throw new Error(`Event with id ${id} not found`)
      }

      // Обновляем статус мероприятия
      const updatedEvent: Event = {
        ...MOCK_EVENTS[eventIndex],
        status,
        updatedAt: new Date().toISOString()
      }

      return updatedEvent
    },
    onSuccess: (data) => {
      // Инвалидируем кэш для этого конкретного мероприятия и списка
      queryClient.invalidateQueries({ queryKey: ['event', data.id] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}
