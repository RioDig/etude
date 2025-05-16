import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

interface DatePickerProps {
  /**
   * Выбранная дата
   */
  value?: Date | null

  /**
   * Обработчик изменения даты
   */
  onChange?: (date: Date) => void

  /**
   * Минимальная дата для выбора
   */
  minDate?: Date

  /**
   * Максимальная дата для выбора
   */
  maxDate?: Date

  /**
   * Начальный месяц для отображения
   * @default текущий месяц
   */
  initialMonth?: Date

  /**
   * Обработчик закрытия календаря
   */
  onClose?: () => void

  /**
   * Дополнительные классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

/**
 * Компонент календаря для выбора даты
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  initialMonth,
  onClose,
  className,
  testId = 'datepicker'
}) => {
  const today = new Date()

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth || value || today)
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(false)
  const yearDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element)
          .closest('button')
          ?.innerText?.includes(currentMonth.getFullYear().toString())
      ) {
        setIsYearSelectOpen(false)
      }
    }

    if (isYearSelectOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isYearSelectOpen, currentMonth])

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(year)
    setCurrentMonth(newDate)
    setIsYearSelectOpen(false)
  }

  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth)
    } else if (value) {
      setCurrentMonth(value)
    }
  }, [initialMonth, value])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prev.getMonth() - 1)
      return prevMonth
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(prev.getMonth() + 1)
      return nextMonth
    })
  }

  const isDateSelectable = (date: Date): boolean => {
    if (minDate && date < minDate) return false
    return !(maxDate && date > maxDate)
  }

  const handleSelectDate = (date: Date) => {
    if (!isDateSelectable(date)) return
    if (onChange) onChange(date)
    if (onClose) onClose()
  }

  const handleGoToToday = () => {
    setCurrentMonth(today)
    if (isDateSelectable(today)) {
      if (onChange) onChange(today)
    }
  }

  const renderCalendarGrid = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)

    let firstDayOfMonth = getFirstDayOfMonth(year, month)

    firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth

    const days = []

    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = firstDayOfMonth - 1; i > 0; i--) {
      const day = new Date(year, month - 1, prevMonthDays - i + 1)
      days.push(day)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    const totalCells = Math.ceil(days.length / 7) * 7
    const nextMonthDays = totalCells - days.length

    for (let i = 1; i <= nextMonthDays; i++) {
      const day = new Date(year, month + 1, i)
      days.push(day)
    }

    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return weeks
  }

  const weeks = renderCalendarGrid()

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]',
        'w-full max-w-[280px]',
        className
      )}
      data-testid={testId}
    >
      <div className="flex items-center justify-between p-[16px_16px_8px_16px]">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 border border-transparent hover:bg-mono-200 active:bg-mono-300 focus:border focus:border-purple-600 rounded-md transition-colors"
          aria-label="Предыдущий месяц"
        >
          <KeyboardArrowLeft sx={{ width: 24, height: 24 }} />
        </button>

        <div className="flex items-center">
          <span className="text-b3-regular text-mono-950 mr-1">
            {monthNames[currentMonth.getMonth()]}
          </span>
          <button
            type="button"
            onClick={() => setIsYearSelectOpen(!isYearSelectOpen)}
            className="text-b3-semibold text-blue-500 hover:text-blue-700 active:text-blue-900 focus:text-blue-900 focus:outline-none"
          >
            {currentMonth.getFullYear()}
          </button>

          {isYearSelectOpen && (
            <div
              ref={yearDropdownRef}
              className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-lg rounded-md border border-mono-300 w-[74px]"
            >
              <div className="py-1 max-h-[200px] overflow-y-auto">
                {Array(11)
                  .fill(0)
                  .map((_, index) => {
                    const year = currentMonth.getFullYear() - 5 + index
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={clsx(
                          'w-full px-4 py-2 text-left text-b4-regular text-mono-950',
                          'hover:bg-mono-100',
                          'active:bg-mono-200',
                          year === currentMonth.getFullYear()
                            ? 'bg-blue-50 text-blue-500'
                            : 'text-mono-900'
                        )}
                      >
                        {year}
                      </button>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 border border-transparent hover:bg-mono-200 active:bg-mono-300 focus:border focus:border-purple-600 rounded-md transition-colors"
          aria-label="Следующий месяц"
        >
          <KeyboardArrowRight sx={{ width: 24, height: 24 }} />
        </button>
      </div>
      <div className="p-[8px_16px]">
        <div className="grid grid-cols-7 text-center">
          {weekdayNames.map((day) => (
            <div
              key={day}
              className={clsx('text-b3-regular text-mono-700 h-[36px] w-[36px] content-center')}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                const isToday = isSameDay(day, today)
                const isSelected = value && isSameDay(day, value)
                const isSelectable = isDateSelectable(day)
                const isWeekend = dayIndex >= 5
                const isCurrentMonth = isSameMonth(day, currentMonth)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={!isSelectable}
                    onClick={() => handleSelectDate(day)}
                    className={clsx(
                      'flex flex-col items-center justify-center',
                      'h-[36px] w-[36px] rounded-[4px]',
                      'text-b3-regular transition-colors',
                      'relative',

                      isCurrentMonth && !isWeekend && !isSelected && 'text-mono-950',
                      isCurrentMonth && isWeekend && !isSelected && 'text-red-600',

                      !isCurrentMonth && !isWeekend && !isSelected && 'text-mono-600',
                      !isCurrentMonth && isWeekend && !isSelected && 'text-red-300',

                      isToday &&
                        !isSelected &&
                        'after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-[18px] after:h-[1px] after:bg-mono-950',

                      isSelected && 'bg-blue-500 text-mono-25 hover:bg-blue-600',

                      !isSelected && 'hover:bg-mono-200',

                      !isSelectable && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label={`${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}`}
                    aria-selected={isSelected ? true : undefined}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="h-[52px] p-2 border-t border-t-mono-300">
        <div className="p-[8px_12px]">
          <button
            type="button"
            onClick={handleGoToToday}
            className="w-full text-b4-medium text-mono-900 hover:text-mono-950 cursor-pointer text-center"
          >
            К сегодняшнему дню
          </button>
        </div>
      </div>
    </div>
  )
}

export default DatePicker
