import { useEffect, useState, useCallback } from 'react'

type CalendarViewMode = 'week' | 'month'

/**
 * Хук для управления навигацией календаря расписания
 */
export const useScheduleNavigation = (
  initialDate: Date = new Date(),
  initialViewMode: CalendarViewMode = 'month',
  onDateChange?: (date: Date) => void,
  onViewModeChange?: (mode: CalendarViewMode) => void
) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null)

  // Обработчик перехода к предыдущему периоду
  const handlePrevPeriod = useCallback(() => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)

    if (onDateChange) {
      onDateChange(newDate)
    }
  }, [currentDate, viewMode, onDateChange])

  // Обработчик перехода к следующему периоду
  const handleNextPeriod = useCallback(() => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)

    if (onDateChange) {
      onDateChange(newDate)
    }
  }, [currentDate, viewMode, onDateChange])

  // Обработчик открытия DatePicker
  const handleOpenDatePicker = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }, [])

  // Обработчик выбора даты
  const handleDateSelect = useCallback(
    (date: Date) => {
      setCurrentDate(date)
      setIsDatePickerOpen(false)

      if (onDateChange) {
        onDateChange(date)
      }
    },
    [onDateChange]
  )

  // Обработчик смены режима просмотра
  const handleViewModeChange = useCallback(
    (mode: string) => {
      const newMode = mode as CalendarViewMode
      setViewMode(newMode)

      if (onViewModeChange) {
        onViewModeChange(newMode)
      }
    },
    [onViewModeChange]
  )

  // Форматирование заголовка
  const formatCalendarTitle = useCallback(() => {
    if (viewMode === 'week') {
      // Для недели показываем диапазон дат
      const startOfWeek = new Date(currentDate)
      const day = startOfWeek.getDay() // 0-6 (0 - воскресенье)

      // Находим понедельник текущей недели
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
      startOfWeek.setDate(diff)

      // Находим воскресенье (конец недели)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      // Форматируем диапазон
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
      // Для месяца показываем название месяца и год
      return currentDate.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric'
      })
    }
  }, [currentDate, viewMode])

  // Эффект для закрытия DatePicker при клике вне компонента
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

  return {
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
  }
}
