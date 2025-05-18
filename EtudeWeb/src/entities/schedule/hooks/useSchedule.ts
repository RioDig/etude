import { useQuery, useQueryClient } from '@tanstack/react-query'
import { scheduleApi } from '../api/scheduleApi'
import { usePageFilters } from '@/entities/filter'
import { CalendarCard } from '@/widgets/calendar/model/types'
import { CourseTemplate } from '@/shared/types'

/**
 * Хук для получения данных расписания с учетом фильтров
 */
export const useSchedule = () => {
  const { filters } = usePageFilters('schedule-page')

  const {
    data: templates,
    isLoading,
    error
  } = useQuery({
    queryKey: ['schedule', filters],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    queryFn: () => scheduleApi.getSchedule(filters),
    staleTime: 1000 * 60 * 5
  })

  const calendarCards: CalendarCard[] =
    templates?.map((template: CourseTemplate) => ({
      id: template.course_template_id,
      title: template.course_template_name,
      status: undefined,
      startDate: new Date(template.course_template_startDate || new Date()),
      endDate: new Date(template.course_template_endDate || new Date()),
      description: template.course_template_description || '',
      trainingCenter: template.course_template_trainingCenter || 'Не указан',
      format: template.course_template_format,
      track: template.course_template_track,
      type: template.course_template_type
    })) || []

  return {
    data: calendarCards,
    rawData: templates,
    isLoading,
    error
  }
}

/**
 * Хук для получения деталей шаблона
 */
export const useScheduleTemplate = (id?: string) => {
  return useQuery({
    queryKey: ['scheduleTemplate', id],
    queryFn: () => scheduleApi.getScheduleTemplateById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })
}
