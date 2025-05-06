import React, { useState, useCallback } from 'react'
import { Container } from '@/shared/ui/container'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Switch } from '@/shared/ui/switch'
import { Filter } from '@/shared/ui/filter'
import { FilterOption } from '@/shared/ui/filter/types'
import { CalendarTodayOutlined, TableChartOutlined, Add } from '@mui/icons-material'
import { Sidebar } from '@/widgets/sidebar'
import { EventsTable } from './EventsTable'
import { EventsCalendar } from './EventsCalendar'
import { EventsSidebar } from './EventsSidebar'
import { useEvents } from '@/entities/event'
import { Event } from '@/entities/event/model/types'

/**
 * Страница списка мероприятий с двумя режимами отображения:
 * таблица и календарь
 */
export const EventsPage: React.FC = () => {
  // Состояние для режима отображения (table или calendar)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  // Состояние для открытия/закрытия сайдбара и выбранного мероприятия
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Получение данных мероприятий с использованием хука
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

  // Обработчик изменения режима отображения
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as 'table' | 'calendar')
  }

  // Обработчик выбора мероприятия для отображения в сайдбаре
  const handleEventSelect = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsSidebarOpen(true)
  }, [])

  // Обработчик закрытия сайдбара
  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  // Обработчик для создания нового мероприятия
  const handleCreateEvent = () => {
    // Здесь будет код перехода на страницу создания мероприятия
    console.log('Create new event')
  }

  return (
    <Container className="flex flex-col gap-6 h-full max-w-[1200px] mx-auto">
      {/* Верхний блок с заголовком и кнопкой создания */}
      <div className="flex justify-between items-center">
        <Typography variant="h2">Обучения</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleCreateEvent}>
          Новое заявление
        </Button>
      </div>

      {/* Блок с фильтрами и переключателем режимов */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex-grow">
          <Filter filters={filterOptions} pageId="events-page" className="flex-wrap" />
        </div>
        <div className="flex-shrink-0">
          <Switch options={viewModeOptions} value={viewMode} onChange={handleViewModeChange} />
        </div>
      </div>

      {/* Блок содержимого: таблица или календарь */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'table' ? (
          <EventsTable
            events={events || []}
            isLoading={isLoading}
            error={error ? String(error) : undefined}
            onEventSelect={handleEventSelect}
          />
        ) : (
          <EventsCalendar
            events={events || []}
            isLoading={isLoading}
            error={error ? String(error) : undefined}
            onEventSelect={handleEventSelect}
          />
        )}
      </div>

      {/* Сайдбар с информацией о мероприятии */}
      <EventsSidebar open={isSidebarOpen} onClose={handleSidebarClose} event={selectedEvent} />
    </Container>
  )
}

export default EventsPage
