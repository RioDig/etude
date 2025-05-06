import React, { useRef } from 'react'
import { Calendar } from '@/widgets/calendar'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Event } from '@/entities/event/model/types'
import { CalendarCard } from '@/widgets/calendar/model/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

interface EventsCalendarProps {
  events: Event[]
  isLoading: boolean
  error?: string
  onEventSelect: (event: Event) => void
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
  // Сохраняем соответствие между карточками и строками
  const cardRowMapRef = useRef<Record<string, number>>({})

  // Преобразуем данные Event в формат CalendarCard
  const transformEventsToCalendarCards = (events: Event[]): CalendarCard[] => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      status: event.status,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      description: event.description || '',
      employee: event.employee || 'Не указан',
      format: event.format,
      category: event.category,
      type: event.type
    }))
  }

  // Обработчик клика по карточке
  const handleCardClick = (card: CalendarCard) => {
    // Находим оригинальное событие по id
    const originalEvent = events.find((e) => e.id === card.id)
    if (originalEvent) {
      onEventSelect(originalEvent)
    }
  }

  // Обработчик изменения даты в календаре
  const handleCalendarDateChange = (date: Date) => {
    if (onDateChange) {
      onDateChange(date)
    }
  }

  // Подготавливаем компоненты для разных состояний
  const loadingComponent = (
    <div className="flex justify-center items-center h-full">
      <Spinner size="large" label="Загрузка календаря..." />
    </div>
  )

  const errorOrEmptyComponent = (
    <div className="flex justify-center items-center h-full">
      <EmptyMessage
        variant="small"
        imageUrl={EmptyStateSvg}
        title={error ? 'Ошибка загрузки данных' : 'Нет данных для отображения'}
        description={error || 'В системе пока нет мероприятий или они были отфильтрованы'}
      />
    </div>
  )

  // Преобразуем события в формат карточек календаря
  const calendarCards = events?.length > 0 ? transformEventsToCalendarCards(events) : []

  return (
    <div className="h-full">
      <Calendar
        cards={calendarCards}
        onCardClick={handleCardClick}
        pageId="events-calendar"
        emptyComponent={isLoading ? loadingComponent : errorOrEmptyComponent}
        initialDate={initialDate}
        initialViewMode={viewMode}
        onDateChange={handleCalendarDateChange}
        hideControls={true} // Скрываем встроенные элементы управления календаря
      />
    </div>
  )
}

export default EventsCalendar
