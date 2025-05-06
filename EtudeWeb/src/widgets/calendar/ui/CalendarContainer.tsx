import React from 'react'
import { CalendarProps } from '../model/types'
import { Calendar } from './Calendar'
import { CalendarHeader } from './CalendarHeader'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'

interface CalendarContainerProps extends CalendarProps {
  isLoading?: boolean
  emptyComponent?: React.ReactNode
  errorComponent?: React.ReactNode
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  cards,
  initialViewMode = 'month',
  initialDate = new Date(),
  onCardClick,
  onDateChange,
  onViewModeChange,
  pageId = 'calendar',
  isLoading,
  emptyComponent,
  errorComponent
}) => {
  // Хук для управления навигацией
  const {
    viewMode,
    currentDate,
    isDatePickerOpen,
    datePickerAnchor,
    handlePrevPeriod,
    handleNextPeriod,
    handleGoToToday,
    handleOpenDatePicker,
    handleDateSelect,
    formatHeaderTitle,
    handleViewModeChange,
    setIsDatePickerOpen
  } = useCalendarNavigation(initialDate, initialViewMode, onDateChange, onViewModeChange)

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок календаря */}
      <CalendarHeader
        title={formatHeaderTitle()}
        viewMode={viewMode}
        isDatePickerOpen={isDatePickerOpen}
        datePickerAnchor={datePickerAnchor}
        currentDate={currentDate}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
        onGoToToday={handleGoToToday}
        onOpenDatePicker={handleOpenDatePicker}
        onDateSelect={handleDateSelect}
        onViewModeChange={handleViewModeChange}
        setIsDatePickerOpen={setIsDatePickerOpen}
      />

      {/* Содержимое календаря */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          // Если загрузка - показываем индикатор
          <div className="h-full"></div>
        ) : errorComponent ? (
          // Если ошибка - показываем ошибку
          errorComponent
        ) : emptyComponent && cards.length === 0 ? (
          // Если нет данных - показываем пустое состояние
          emptyComponent
        ) : (
          // Если есть данные - показываем календарь
          <Calendar
            cards={cards}
            initialViewMode={viewMode}
            initialDate={currentDate}
            onCardClick={onCardClick}
            pageId={pageId}
          />
        )}
      </div>
    </div>
  )
}
