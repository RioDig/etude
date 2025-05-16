import React, { useState, useCallback, useEffect } from 'react'
import { Container } from '@/shared/ui/container'
import { Typography } from '@/shared/ui/typography'
import { Switch } from '@/shared/ui/switch'
import { Filter } from '@/shared/ui/filter'
import { FilterOption } from '@/shared/ui/filter/types'
import { Counter } from '@/shared/ui/counter'
import {
  CalendarTodayOutlined,
  TableChartOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material'
import { EventsTable } from './EventsTable'
import { EventsCalendar } from './EventsCalendar'
import { EventsSidebar } from './EventsSidebar'
import { useEvents } from '@/entities/event'
import { Event } from '@/entities/event/model/types'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'
import { createPortal } from 'react-dom'

export const EventsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null)

  const { data: events, isLoading, error } = useEvents()

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

  const viewModeOptions = [
    { id: 'table', label: 'Таблица', icon: <TableChartOutlined /> },
    { id: 'calendar', label: 'Календарь', icon: <CalendarTodayOutlined /> }
  ]

  const calendarViewOptions = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' }
  ]

  const [calendarViewMode, setCalendarViewMode] = useState('month')

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

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  const formatCalendarTitle = () => {
    if (calendarViewMode === 'week') {
      const startOfWeek = new Date(currentDate)
      const day = startOfWeek.getDay() // 0-6 (0 - воскресенье)

      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
      startOfWeek.setDate(diff)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const startDateStr = startOfWeek.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      })

      const endDateStr = endOfWeek.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      return `${startDateStr} - ${endDateStr}`
    } else {
      return currentDate.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric'
      })
    }
  }

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate)
    if (calendarViewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate)
    if (calendarViewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    setIsDatePickerOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerAnchor &&
        !datePickerAnchor.contains(event.target as Node) &&
        !(event.target as Element).closest('.datepicker-container')
      ) {
        setIsDatePickerOpen(false)
      }
    }

    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDatePickerOpen, datePickerAnchor])

  const eventsCount = events?.length || 0

  return (
    <Container className="flex flex-col gap-6 h-full w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Typography variant="h2">Мероприятия</Typography>
          <Counter value={eventsCount} />
        </div>
        <Switch options={viewModeOptions} value={viewMode} onChange={handleViewModeChange} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-grow">
          <Filter filters={filterOptions} pageId="events-page" className="flex-wrap" />
        </div>

        {viewMode === 'calendar' && (
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
              value={calendarViewMode}
              onChange={handleCalendarViewChange}
              size="small"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <div className="h-full overflow-auto flex flex-col ">
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

      {selectedEvent && (
        <EventsSidebar open={isSidebarOpen} onClose={handleSidebarClose} event={selectedEvent} />
      )}
    </Container>
  )
}

export default EventsPage
