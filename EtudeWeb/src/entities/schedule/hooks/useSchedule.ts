import { useQuery } from '@tanstack/react-query'
import { scheduleApi } from '../api/scheduleApi'
import { usePageFilters } from '@/entities/filter'
import { CalendarCard } from '@/widgets/calendar/model/types'
import { Template } from '@/entities/template'

/**
 * Хук для получения данных расписания с учетом фильтров
 */
export const useSchedule = () => {
  const { filters } = usePageFilters('schedule-page')

  // Формируем параметры фильтрации для API
  const apiFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  // Запрашиваем данные через React Query
  const {
    data: templates,
    isLoading,
    error
  } = useQuery({
    queryKey: ['schedule', filters],
    queryFn: () => scheduleApi.getSchedule(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })

  // Преобразуем шаблоны в формат карточек календаря
  const calendarCards: CalendarCard[] =
    templates?.map((template: Template) => ({
      id: template.id,
      title: template.name,
      status: 'completed', // Все карточки серые
      startDate: new Date(template.startDate || new Date()),
      endDate: new Date(template.endDate || new Date()),
      description: `${template.type}, ${template.format}, ${template.category}`,
      employee: template.trainingCenter || 'Не указан',
      format: template.format.toLowerCase().includes('онлайн')
        ? 'online'
        : template.format.toLowerCase().includes('очно')
          ? 'offline'
          : 'mixed',
      category: template.category.toLowerCase().includes('hard')
        ? 'hard-skills'
        : template.category.toLowerCase().includes('soft')
          ? 'soft-skills'
          : 'management',
      type: template.type.toLowerCase().includes('курс')
        ? 'course'
        : template.type.toLowerCase().includes('конференц')
          ? 'conference'
          : template.type.toLowerCase().includes('вебинар')
            ? 'webinar'
            : 'training'
    })) || []

  return {
    data: calendarCards,
    isLoading,
    error
  }
}
