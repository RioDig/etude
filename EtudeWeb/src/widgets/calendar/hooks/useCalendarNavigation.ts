import { useState, useCallback } from 'react'
import { CalendarViewMode } from '../model/types'

/**
 * Хук для управления навигацией по календарю
 * @param initialDate Начальная дата
 * @param initialViewMode Начальный режим отображения
 * @param onDateChange Обработчик изменения даты
 * @param onViewModeChange Обработчик изменения режима отображения
 * @returns Объект с состоянием и методами навигации
 */
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

  const handleGoToToday = useCallback(() => {
    const today = new Date()
    setCurrentDate(today)
    if (onDateChange) onDateChange(today)
  }, [onDateChange])

  const handleOpenDatePicker = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }, [])

  const handleDateSelect = useCallback(
    (date: Date) => {
      setCurrentDate(date)
      setIsDatePickerOpen(false)
      if (onDateChange) onDateChange(date)
    },
    [onDateChange]
  )

  const formatHeaderTitle = useCallback(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    } else if (viewMode === 'week') {
      const currentDay = new Date(currentDate)
      const day = currentDay.getDay() // 0 (воскресенье) - 6 (суббота)

      const startOfWeek = new Date(currentDay)
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Если воскресенье, отнимаем 6
      startOfWeek.setDate(diff)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const startDateStr = startOfWeek.toLocaleString('ru-RU', { day: 'numeric', month: 'long' })
      const endDateStr = endOfWeek.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      return `${startDateStr} - ${endDateStr}`
    } else {
      return `${currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })} - ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}`
    }
  }, [currentDate, viewMode])

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
    handleGoToToday,
    handleOpenDatePicker,
    handleDateSelect,
    formatHeaderTitle,
    handleViewModeChange,
    setIsDatePickerOpen
  }
}
