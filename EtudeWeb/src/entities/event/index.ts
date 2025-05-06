// Экспорт типов
export * from './model/types'

// Экспорт API и моков
export { eventApi } from './api/eventApi'

// Экспорт хуков
export {
  useEvents,
  useEventDetails,
  useCreateEvent,
  useUpdateEvent,
  useChangeEventStatus
} from './hooks/useEvents'
