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
  const cardRowMapRef = useRef<Record<string, number>>({})

  const { filters } = usePageFilters(pageId)

  const { calendarDays, distributedCards, maxRows } = useCalendarData(
    cards,
    initialViewMode,
    initialDate,
    cardRowMapRef,
    filters
  )

  const handleCardClick = (card: CalendarCard) => {
    if (onCardClick) {
      onCardClick(card)
    }
  }

  useEffect(() => {
    const preserveCardRows = () => {}

    preserveCardRows()
  }, [initialDate, initialViewMode])

  return (
    <div className={clsx('flex flex-col h-full', emptyComponent && 'justify-center', className)}>
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
