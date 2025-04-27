// src/widgets/calendar/ui/Calendar.tsx
import React, { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'
import { CalendarCard, CalendarProps } from '../model/types'
import { useCalendarData } from '../hooks/useCalendarData'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'

export const Calendar: React.FC<CalendarProps> = ({
  cards,
  initialViewMode = 'month',
  initialDate = new Date(),
  className,
  onCardClick,
  onDateChange,
  onViewModeChange
}) => {
  // Используем реф для отслеживания распределения карточек по строкам
  const cardRowMapRef = useRef<Record<string, number>>({})

  // Хук для навигации по календарю
  const {
    viewMode,
    currentDate,
    isDatePickerOpen,
    datePickerAnchor,
    handlePrevPeriod,
    handleNextPeriod,
    handleOpenDatePicker,
    handleDateSelect,
    formatHeaderTitle,
    handleViewModeChange,
    setIsDatePickerOpen
  } = useCalendarNavigation(initialDate, initialViewMode, onDateChange, onViewModeChange)

  // Хук для обработки данных календаря
  const { calendarDays, distributedCards, maxRows } = useCalendarData(
    cards,
    viewMode,
    currentDate,
    cardRowMapRef
  )

  // Обработчик клика на карточку
  const handleCardClick = (card: CalendarCard) => {
    if (onCardClick) {
      onCardClick(card)
    }
  }

  // Обработчик клика вне DatePicker
  useEffect(() => {
    if (!isDatePickerOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // Проверяем, что клик не по кнопке датапикера
      if (datePickerAnchor && !datePickerAnchor.contains(event.target as Node)) {
        // Проверяем, что клик не внутри самого DatePicker
        const datePickerElement = document.querySelector('[data-testid="datepicker"]')
        if (!datePickerElement || !datePickerElement.contains(event.target as Node)) {
          setIsDatePickerOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDatePickerOpen, datePickerAnchor, setIsDatePickerOpen])

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Верхняя панель навигации и управления */}
      <CalendarHeader
        title={formatHeaderTitle()}
        viewMode={viewMode}
        isDatePickerOpen={isDatePickerOpen}
        datePickerAnchor={datePickerAnchor}
        currentDate={currentDate}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
        onOpenDatePicker={handleOpenDatePicker}
        onDateSelect={handleDateSelect}
        onViewModeChange={handleViewModeChange}
        setIsDatePickerOpen={setIsDatePickerOpen}
      />

      {/* Сетка календаря */}
      <CalendarGrid
        days={calendarDays}
        distributedCards={distributedCards}
        maxRows={maxRows}
        onCardClick={handleCardClick}
      />
    </div>
  )
}

export default Calendar
