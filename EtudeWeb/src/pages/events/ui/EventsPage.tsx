import React, { useState, useCallback, useEffect } from 'react'
import { Container } from '@/shared/ui/container'
import { Typography } from '@/shared/ui/typography'
import { Switch } from '@/shared/ui/switch'
import { Filter } from '@/shared/ui/filter'
import { FilterOption } from '@/shared/ui/filter/types'
import { Counter } from '@/shared/ui/counter'
import { CalendarTodayOutlined, TableChartOutlined } from '@mui/icons-material'
import { EventsTable } from './EventsTable'
import { EventsCalendar } from './EventsCalendar'
import { EventsSidebar } from './EventsSidebar'
import { useEvents } from '@/entities/event'
import { Event } from '@/entities/event/model/types'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'

export const EventsPage: React.FC = () => {
  // Состояние для режима отображения и сайдбара
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Состояние для хранения текущей даты при переключении видов
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null)

  // Получение данных мероприятий
  const { data: events, isLoading, error } = useEvents()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'conference', label: 'Конференция' },
        { value: 'course', label: 'Курс' },
        { value: 'webinar', label: 'Вебинар' },
        { value: 'training', label: 'Тренинг' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'offline', label: 'Очно' },
        { value: 'online', label: 'Онлайн' },
        { value: 'mixed', label: 'Смешанный' }
      ]
    },
    {
      id: 'category',
      label: 'Категория',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все категории' },
        { value: 'hard-skills', label: 'Hard Skills' },
        { value: 'soft-skills', label: 'Soft Skills' },
        { value: 'management', label: 'Management' }
      ]
    },
    {
      id: 'status',
      label: 'Статус',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все статусы' },
        { value: 'pending', label: 'На согласовании' },
        { value: 'approved', label: 'Согласовано' },
        { value: 'rejected', label: 'Отклонено' },
        { value: 'completed', label: 'Пройдено' }
      ]
    }
  ]

  // Опции для переключателя режимов отображения
  const viewModeOptions = [
    { id: 'table', label: 'Таблица', icon: <TableChartOutlined /> },
    { id: 'calendar', label: 'Календарь', icon: <CalendarTodayOutlined /> }
  ]

  // Опции для переключателя режима календаря
  const calendarViewOptions = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' }
  ]

  // Состояние для режима календаря
  const [calendarViewMode, setCalendarViewMode] = useState('month')

  // Обработчики событий
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as 'table' | 'calendar')
  }

  const handleCalendarViewChange = (mode: string) => {
    setCalendarViewMode(mode)
  }

  const handleEventSelect = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsSidebarOpen(true)
  }, [])

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  // Обработчик изменения текущей даты в календаре
  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  // Обработчик открытия DatePicker
  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }

  // Обработчик выбора даты
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    setIsDatePickerOpen(false)
  }

  // Получение количества событий для счетчика
  const eventsCount = events?.length || 0

  return (
    <Container className="flex flex-col gap-6 h-full w-full">
      {/* Верхний блок с заголовком и переключателем режимов отображения */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Typography variant="h2">Обучения</Typography>
          <Counter value={eventsCount} />
        </div>
        <Switch options={viewModeOptions} value={viewMode} onChange={handleViewModeChange} />
      </div>

      {/* Блок с фильтрами и элементами управления календарем */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-grow">
          <Filter filters={filterOptions} pageId="events-page" className="flex-wrap" />
        </div>

        {/* Элементы управления календарем, видимые только в режиме календаря */}
        {viewMode === 'calendar' && (
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            <button
              className="flex items-center gap-1 px-3 py-1 hover:bg-mono-100 rounded-md transition-colors"
              onClick={handleOpenDatePicker}
              aria-label="Выбрать дату"
            >
              <span className="text-b3-semibold">{currentDate.toLocaleDateString('ru-RU')}</span>
              <CalendarTodayOutlined fontSize="small" />
            </button>

            <Switch
              options={calendarViewOptions}
              value={calendarViewMode}
              onChange={handleCalendarViewChange}
              size="small"
            />

            {isDatePickerOpen && datePickerAnchor && (
              <div
                className="fixed z-50"
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Содержимое: таблица или календарь */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <div className="h-full overflow-auto">
            <EventsTable
              events={events || []}
              isLoading={isLoading}
              error={error ? String(error) : undefined}
              onEventSelect={handleEventSelect}
            />
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <EventsCalendar
              events={events || []}
              isLoading={isLoading}
              error={error ? String(error) : undefined}
              onEventSelect={handleEventSelect}
              initialDate={currentDate}
              onDateChange={handleDateChange}
              viewMode={calendarViewMode as 'week' | 'month'}
            />
          </div>
        )}
      </div>

      {/* Сайдбар с информацией о мероприятии */}
      {selectedEvent && (
        <EventsSidebar open={isSidebarOpen} onClose={handleSidebarClose} event={selectedEvent} />
      )}
    </Container>
  )
}

export default EventsPage
