import React, { useCallback, useState } from 'react'
import { Container } from '@/shared/ui/container'
import { Filter } from '@/shared/ui/filter'
import { Switch } from '@/shared/ui/switch'
import { Calendar } from '@/widgets/calendar'
import { CalendarCard } from '@/widgets/calendar/model/types'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Typography } from '@/shared/ui/typography'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'
import { CalendarTodayOutlined, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { createPortal } from 'react-dom'

import { useSchedule } from '@/entities/schedule'
import {
  useScheduleNavigation,
  scheduleFilterOptions,
  calendarViewOptions
} from '@/features/schedule'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { ScheduleSidebar } from './ScheduleSidebar'
import { useQueryClient } from '@tanstack/react-query'

export const SchedulePage: React.FC = () => {
  const { data: calendarCards, isLoading, error } = useSchedule()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const queryClient = useQueryClient()
  const {
    currentDate,
    viewMode,
    isDatePickerOpen,
    datePickerAnchor,
    handlePrevPeriod,
    handleNextPeriod,
    handleOpenDatePicker,
    handleDateSelect,
    handleViewModeChange,
    formatCalendarTitle,
    setIsDatePickerOpen
  } = useScheduleNavigation()

  const handleCardClick = useCallback((card: CalendarCard) => {
    setSelectedTemplateId(card.id)
    setIsSidebarOpen(true)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const handleResetFilters = () => {
    queryClient.invalidateQueries({ queryKey: ['schedule'] })
  }

  const errorComponent = error ? (
    <EmptyMessage
      variant="small"
      imageUrl={EmptyStateSvg}
      title="Ошибка загрузки данных"
      description={String(error)}
    />
  ) : null

  const emptyComponent =
    !error && calendarCards.length === 0 && !isLoading ? (
      <EmptyMessage
        variant="small"
        imageUrl={EmptyStateSvg}
        title="Нет запланированных мероприятий"
        description="По выбранным фильтрам не найдено мероприятий"
        className="my-auto"
      />
    ) : null

  return (
    <Container className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <Typography variant="h2">Расписание мероприятий и сторонних курсов</Typography>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-grow">
          <Filter filters={scheduleFilterOptions} pageId="schedule-page" className="flex-wrap" onReset={handleResetFilters} />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPeriod}
              className="p-2 hover:bg-mono-100 rounded-full transition-colors"
              aria-label="Предыдущий период"
            >
              <KeyboardArrowLeft />
            </button>

            <button
              className="flex items-center gap-1 px-3 py-1 hover:bg-mono-100 rounded-md transition-colors"
              onClick={handleOpenDatePicker}
              aria-label="Выбрать дату"
            >
              <span className="text-b3-semibold leading-none mr-2">{formatCalendarTitle()}</span>
              <CalendarTodayOutlined fontSize="small" />
            </button>

            <button
              onClick={handleNextPeriod}
              className="p-2 hover:bg-mono-100 rounded-full transition-colors leading-none"
              aria-label="Следующий период"
            >
              <KeyboardArrowRight />
            </button>
          </div>

          <Switch
            options={calendarViewOptions}
            value={viewMode}
            onChange={handleViewModeChange}
            size="small"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="large" label="Загрузка расписания..." />
          </div>
        ) : (
          <Calendar
            cards={calendarCards}
            onCardClick={handleCardClick}
            pageId="schedule-page"
            emptyComponent={emptyComponent || errorComponent}
            initialDate={currentDate}
            initialViewMode={viewMode}
            onDateChange={handleDateSelect}
            onViewModeChange={handleViewModeChange}
            hideControls={true}
          />
        )}
      </div>

      {isDatePickerOpen &&
        datePickerAnchor &&
        createPortal(
          <div
            className="fixed z-50 datepicker-container"
            style={{
              top: `${datePickerAnchor.getBoundingClientRect().bottom + 8}px`,
              left: `${datePickerAnchor.getBoundingClientRect().left}px`
            }}
          >
            <DatePicker
              value={currentDate}
              onChange={handleDateSelect}
              onClose={() => setIsDatePickerOpen(false)}
            />
          </div>,
          document.body
        )}

      <ScheduleSidebar
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        templateId={selectedTemplateId}
      />
    </Container>
  )
}

export default SchedulePage
