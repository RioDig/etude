import React, { useRef } from 'react'
import { Calendar } from '@/widgets/calendar'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Application } from '@/shared/types'
import { CalendarCard } from '@/widgets/calendar/model/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

interface EventsCalendarProps {
  events: Application[]
  isLoading: boolean
  error?: string
  onEventSelect: (event: Application) => void
  initialDate?: Date
  onDateChange?: (date: Date) => void
  viewMode?: 'week' | 'month'
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  isLoading,
  error,
  onEventSelect,
  initialDate,
  onDateChange,
  viewMode = 'month'
}) => {
  useRef<Record<string, number>>({})

  const transformEventsToCalendarCards = (events: Application[]): CalendarCard[] => {
    return events.map((event) => ({
      id: event.application_id,
      title: event.course.course_name,
      status: event.status.type,
      startDate: new Date(event.course.course_startDate),
      endDate: new Date(event.course.course_endDate),
      description: event.course.course_description || '',
      employee: event.course.course_learner
        ? `${event.course.course_learner.surname} ${event.course.course_learner.name} ${event.course.course_learner.patronymic || ''}`.trim()
        : 'Не указан',
      format: event.course.course_format,
      track: event.course.course_track,
      type: event.course.course_type,
      trainingCenter: event.course.course_trainingCenter
    }))
  }

  const handleCardClick = (card: CalendarCard) => {
    const originalEvent = events.find((e) => e.application_id === card.id)
    if (originalEvent) {
      onEventSelect(originalEvent)
    }
  }

  const handleCalendarDateChange = (date: Date) => {
    if (onDateChange) {
      onDateChange(date)
    }
  }

  const loadingComponent = (
    <div className="flex justify-center items-center h-full">
      <Spinner size="large" label="Загрузка календаря..." />
    </div>
  )

  const errorOrEmptyComponent = (
    <EmptyMessage
      variant="small"
      imageUrl={EmptyStateSvg}
      title={error ? 'Ошибка загрузки данных' : 'Нет данных для отображения'}
      description={error || 'В системе пока нет мероприятий или они были отфильтрованы'}
      className="my-auto"
    />
  )

  const calendarCards = events?.length > 0 ? transformEventsToCalendarCards(events) : []

  return (
    <div className="h-full flex flex-col">
      {isLoading ? (
        loadingComponent
      ) : (
        <Calendar
          cards={calendarCards}
          onCardClick={handleCardClick}
          pageId="events-calendar"
          emptyComponent={events.length === 0 ? errorOrEmptyComponent : undefined}
          initialDate={initialDate}
          initialViewMode={viewMode}
          onDateChange={handleCalendarDateChange}
          hideControls={true}
        />
      )}
    </div>
  )
}

export default EventsCalendar
