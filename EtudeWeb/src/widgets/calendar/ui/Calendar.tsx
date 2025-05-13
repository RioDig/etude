// src/widgets/calendar/ui/Calendar.tsx
import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { CalendarGrid } from './CalendarGrid'
import { CalendarCard, CalendarProps } from '../model/types'
import { useCalendarData } from '../hooks/useCalendarData'
import { usePageFilters } from '@/entities/filter'

interface ExtendedCalendarProps extends CalendarProps {
  emptyComponent?: React.ReactNode
  hideControls?: boolean
}

export const Calendar: React.FC<ExtendedCalendarProps> = ({
  cards,
  initialViewMode = 'month',
  initialDate = new Date(),
  className,
  onCardClick,
  pageId = 'calendar',
  emptyComponent
}) => {
  // Используем реф для отслеживания распределения карточек по строкам
  const cardRowMapRef = useRef<Record<string, number>>({})

  // Получаем состояние из хранилища фильтров
  const { filters } = usePageFilters(pageId)

  // Хук для обработки данных календаря с учетом фильтров
  const { calendarDays, distributedCards, maxRows } = useCalendarData(
    cards,
    initialViewMode,
    initialDate,
    cardRowMapRef,
    filters // Передаем фильтры в хук
  )

  // Обработчик клика на карточку
  const handleCardClick = (card: CalendarCard) => {
    if (onCardClick) {
      onCardClick(card)
    }
  }

  // Сохраняем cardRowMap при смене периода для обеспечения непрерывности отображения
  useEffect(() => {
    const preserveCardRows = () => {
      // Логика сохранения информации о строках карточек
    }

    preserveCardRows()
  }, [initialDate, initialViewMode])

  return (
    <div className={clsx('flex flex-col h-full', emptyComponent && 'justify-center', className)}>
      {/* Контент календаря */}

      {cards && cards.length > 0 ? (
        <CalendarGrid
          days={calendarDays}
          distributedCards={distributedCards}
          viewMode={initialViewMode}
          maxRows={maxRows}
          onCardClick={handleCardClick}
        />
      ) : (
        emptyComponent
      )}
    </div>
  )
}

export default Calendar
