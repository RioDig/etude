import React, { useState, useRef, useEffect } from 'react'
import { Calendar } from '@/widgets/calendar'
import { CalendarCardItem } from '@/widgets/calendar/ui/CalendarCardItem'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { Event } from '@/entities/event/model/types'
import { CalendarCard, CalendarViewMode } from '@/widgets/calendar/model/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

interface EventsCalendarProps {
  events: Event[]
  isLoading: boolean
  error?: string
  onEventSelect: (event: Event) => void
}

/**
 * Компонент для отображения мероприятий в формате календаря
 */
export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  isLoading,
  error,
  onEventSelect
}) => {
  // Текущая дата и режим отображения
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')

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

  // Обработчик изменения даты
  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  // Обработчик изменения режима отображения
  const handleViewModeChange = (mode: CalendarViewMode) => {
    setViewMode(mode)
  }

  // Если идет загрузка, показываем спиннер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" label="Загрузка календаря..." />
      </div>
    )
  }

  // Если есть ошибка, отображаем сообщение об ошибке
  if (error) {
    return (
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title="Ошибка загрузки данных"
        description={error}
      />
    )
  }

  // Если нет мероприятий, показываем пустое состояние
  if (events.length === 0) {
    return (
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title="Нет данных для отображения"
        description="В системе пока нет мероприятий или они были отфильтрованы"
      />
    )
  }

  // Преобразуем события в формат карточек календаря
  const calendarCards = transformEventsToCalendarCards(events)

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        cards={calendarCards}
        initialViewMode={viewMode}
        initialDate={currentDate}
        onCardClick={handleCardClick}
        onDateChange={handleDateChange}
        onViewModeChange={handleViewModeChange}
        pageId="events-calendar"
      />
    </div>
  )
}

export default EventsCalendar
