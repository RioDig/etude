// src/widgets/calendar/ui/Calendar.tsx
import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { CalendarGrid } from './CalendarGrid'
import { CalendarCard, CalendarProps } from '../model/types'
import { useCalendarData } from '../hooks/useCalendarData'
import { usePageFilters } from '@/entities/filter'

interface ExtendedCalendarProps extends CalendarProps {
  emptyComponent?: React.ReactNode;
  hideControls?: boolean;
}

export const Calendar: React.FC<ExtendedCalendarProps> = ({
  cards,
  initialViewMode = 'month',
  initialDate = new Date(),
  className,
  onCardClick,
  onDateChange,
  onViewModeChange,
  pageId = 'calendar',
  emptyComponent,
  hideControls = false
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
    <div className={clsx('flex flex-col h-full', className)}>
      {/* Контент календаря */}
      <div className="h-full overflow-auto">
        {cards && cards.length > 0 ? (
          <CalendarGrid
            days={calendarDays}
            distributedCards={distributedCards}
            viewMode={initialViewMode}
            maxRows={maxRows}
            onCardClick={handleCardClick}
          />
        ) : emptyComponent ? (
          <div className="grid border border-mono-200 rounded-[8px] overflow-auto bg-white h-full">
            <div
              className="grid bg-mono-50"
              style={{
                gridTemplateColumns: `repeat(${calendarDays.length}, minmax(50px, 1fr))`,
                borderBottom: '1px solid #E3E3E3'
              }}
            >
              {calendarDays.map((day, index) => (
                <div
                  key={`header-${index}`}
                  className={clsx(
                    'h-[50px] flex items-center px-[16px] py-[12px] text-b1 text-mono-950 justify-center',
                    '[&:not(:nth-last-child(-n+1))]:border-r-[1px] border-r-mono-200'
                  )}
                >
                  {day.getDate()}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center p-6">
              {emptyComponent}
            </div>
          </div>
        ) : (
          <CalendarGrid
            days={calendarDays}
            distributedCards={[]}
            viewMode={initialViewMode}
            maxRows={1}
            onCardClick={handleCardClick}
          />
        )}
      </div>
    </div>
  )
}

export default Calendar