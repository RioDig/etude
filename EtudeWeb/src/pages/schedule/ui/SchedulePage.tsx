import React, { useCallback } from 'react'
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

// Импорт сущностей и фич
import { useSchedule } from '@/entities/schedule'
import {
  useScheduleNavigation,
  scheduleFilterOptions,
  calendarViewOptions
} from '@/features/schedule'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

export const SchedulePage: React.FC = () => {
  // Получаем данные расписания
  const { data: calendarCards, isLoading, error } = useSchedule()

  // Хук управления навигацией календаря
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

  // Обработчик клика по карточке
  const handleCardClick = useCallback((card: CalendarCard) => {
    console.log('Clicked card:', card)
    // Здесь можно добавить логику для отображения деталей
  }, [])

  // Компонент ошибки при загрузке
  const errorComponent = error ? (
    <EmptyMessage
      variant="small"
      imageUrl={EmptyStateSvg}
      title="Ошибка загрузки данных"
      description={String(error)}
    />
  ) : null

  // Компонент пустого состояния
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
        <Typography variant="h2">Расписание мероприятий</Typography>
      </div>

      {/* Блок с фильтрами и элементами управления календарем */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-grow">
          <Filter filters={scheduleFilterOptions} pageId="schedule-page" className="flex-wrap" />
        </div>

        {/* Элементы управления календарем */}
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

      {/* Календарь */}
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
            hideControls={true} // Скрываем встроенные элементы управления календаря
          />
        )}
      </div>

      {/* DatePicker в портале */}
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
    </Container>
  )
}

export default SchedulePage
