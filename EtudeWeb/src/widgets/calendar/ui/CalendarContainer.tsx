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

  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full"></div>
        ) : errorComponent ? (
          errorComponent
        ) : emptyComponent && cards.length === 0 ? (
          emptyComponent
        ) : (
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
