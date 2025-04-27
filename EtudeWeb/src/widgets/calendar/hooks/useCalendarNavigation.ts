// src/widgets/calendar/hooks/useCalendarNavigation.ts
import { useState, useCallback } from 'react'
import { CalendarViewMode } from '../model/types'

export const useCalendarNavigation = (
  initialDate: Date = new Date(),
  initialViewMode: CalendarViewMode = 'month',
  onDateChange?: (date: Date) => void,
  onViewModeChange?: (mode: CalendarViewMode) => void
) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode)
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null)

  // Функция перехода к предыдущему периоду
  const handlePrevPeriod = useCallback(() => {
    const date = new Date(currentDate)
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() - 1)
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - 7)
    } else {
      date.setMonth(date.getMonth() - 6)
    }
    setCurrentDate(date)
    if (onDateChange) onDateChange(date)
  }, [currentDate, viewMode, onDateChange])

  // Функция перехода к следующему периоду
  const handleNextPeriod = useCallback(() => {
    const date = new Date(currentDate)
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1)
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + 7)
    } else {
      date.setMonth(date.getMonth() + 6)
    }
    setCurrentDate(date)
    if (onDateChange) onDateChange(date)
  }, [currentDate, viewMode, onDateChange])

  // Функция открытия DatePicker
  const handleOpenDatePicker = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }, [])

  // Функция обработки выбора даты
  const handleDateSelect = useCallback(
    (date: Date) => {
      setCurrentDate(date)
      setIsDatePickerOpen(false)
      if (onDateChange) onDateChange(date)
    },
    [onDateChange]
  )

  // Функция форматирования заголовка
  const formatHeaderTitle = useCallback(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    } else if (viewMode === 'week') {
      // Расчет начала и конца недели будет происходить в useCalendarData,
      // поэтому здесь мы просто возвращаем месяц и год
      return currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    } else {
      return `${currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })} - ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}`
    }
  }, [currentDate, viewMode])

  // Обработчик смены режима просмотра
  const handleViewModeChange = useCallback(
    (newMode: string) => {
      const mode = newMode as CalendarViewMode
      setViewMode(mode)
      if (onViewModeChange) onViewModeChange(mode)
    },
    [onViewModeChange]
  )

  return {
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
  }
}
