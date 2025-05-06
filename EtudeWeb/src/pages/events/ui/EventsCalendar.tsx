import React, { useState, useRef } from 'react'
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
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({
  events,
  isLoading,
  error,
  onEventSelect
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

  // Если идет загрузка, показываем спиннер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="large" label="Загрузка календаря..." />
      </div>
    )
  }

  // Если данных нет или возникла ошибка, показываем пустое состояние
  if (error || events.length === 0) {
    return (
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title={error ? 'Ошибка загрузки данных' : 'Нет данных для отображения'}
        description={error || 'В системе пока нет мероприятий или они были отфильтрованы'}
      />
    )
  }

  // Преобразуем события в формат карточек календаря
  const calendarCards = transformEventsToCalendarCards(events)

  return (
    <div className="h-full">
      <Calendar cards={calendarCards} onCardClick={handleCardClick} pageId="events-calendar" />
    </div>
  )
}

export default EventsCalendar
