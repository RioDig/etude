import React, { useState, useEffect, useMemo } from 'react'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'
import { Switch } from '@/shared/ui/switch'
import { Hint } from '@/shared/ui/hint'
import { Tag } from '@/shared/ui/tag'
import { CalendarTodayOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import clsx from 'clsx'
import { CalendarCard, CalendarProps, CalendarViewMode, CardStatus } from '../model/types'

// Функция для форматирования даты
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Генерация дней для календаря
const generateCalendarDays = (startDate: Date, days: number): Date[] => {
  const result = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < days; i++) {
    result.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

// Получение человеко-читаемых названий для свойств карточки
const getFormatLabel = (format: string) => {
  switch (format) {
    case 'offline':
      return 'Очный'
    case 'online':
      return 'Дистанционный'
    case 'mixed':
      return 'Смешанный'
    default:
      return format
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'hard-skills':
      return 'Hard Skills'
    case 'soft-skills':
      return 'Soft Skills'
    case 'management':
      return 'Management'
    default:
      return category
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'course':
      return 'Курс'
    case 'conference':
      return 'Конференция'
    case 'webinar':
      return 'Вебинар'
    case 'training':
      return 'Тренинг'
    default:
      return type
  }
}

// Функция для определения цвета статуса карточки
const getStatusColor = (status: CardStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 border-yellow-300'
    case 'approved':
      return 'bg-green-100 border-green-300'
    case 'rejected':
      return 'bg-red-100 border-red-300'
    case 'completed':
      return 'bg-mono-100 border-mono-300'
    default:
      return 'bg-mono-100 border-mono-300'
  }
}

// Функция для определения текста статуса карточки
const getStatusText = (status: CardStatus): string => {
  switch (status) {
    case 'pending':
      return 'На согласовании'
    case 'approved':
      return 'Согласовано'
    case 'rejected':
      return 'Отклонено'
    case 'completed':
      return 'Пройдено'
    default:
      return ''
  }
}

// Главный компонент календаря
export const Calendar: React.FC<CalendarProps> = ({
  cards,
  initialViewMode = 'month',
  initialDate = new Date(),
  className,
  onCardClick,
  onDateChange,
  onViewModeChange
}) => {
  // Состояния для управления календарем
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode)
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [datePickerAnchor, setDatePickerAnchor] = useState<HTMLElement | null>(null)

  // Количество дней для отображения в зависимости от режима просмотра
  const daysToShow = useMemo(() => {
    switch (viewMode) {
      case 'week':
        return 7
      case 'month': {
        const date = new Date(currentDate)
        date.setDate(1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        return lastDay
      }
      case 'half-year':
        return 30 // Фиксированное количество дней для полугодия с горизонтальным скроллом
      default:
        return 30
    }
  }, [viewMode, currentDate])

  // Получение первого дня для отображения
  const startDay = useMemo(() => {
    const date = new Date(currentDate)

    if (viewMode === 'month') {
      date.setDate(1)
    } else if (viewMode === 'week') {
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Начинаем с понедельника
      date.setDate(diff)
    }

    return date
  }, [viewMode, currentDate])

  // Генерация массива дней для отображения
  const calendarDays = useMemo(() => {
    return generateCalendarDays(startDay, daysToShow)
  }, [startDay, daysToShow])

  // Распределение карточек по отображаемым дням
  const visibleCards = useMemo(() => {
    return cards.filter((card) => {
      // Проверка, что хотя бы один день карточки попадает в видимый диапазон
      const cardStartTime = card.startDate.getTime()
      const cardEndTime = card.endDate.getTime()

      return calendarDays.some((day) => {
        const dayTime = day.getTime()
        const nextDayTime = new Date(day).setHours(23, 59, 59, 999)

        return (
          (cardStartTime <= nextDayTime && cardEndTime >= dayTime) ||
          (cardStartTime >= dayTime && cardStartTime <= nextDayTime)
        )
      })
    })
  }, [cards, calendarDays])

  // Алгоритм распределения карточек по строкам
  const { distributedCards, maxRows } = useMemo(() => {
    // Сортируем карточки по длительности (от самых длинных к коротким)
    const sortedCards = [...visibleCards].sort((a, b) => {
      const durationA = Math.abs(a.endDate.getTime() - a.startDate.getTime())
      const durationB = Math.abs(b.endDate.getTime() - b.startDate.getTime())
      return durationB - durationA
    })

    const firstDay = calendarDays[0].getTime()
    const rows: Array<{ card: CalendarCard; startCol: number; endCol: number }[]> = []

    // Проходим по отсортированным карточкам и распределяем их по строкам
    sortedCards.forEach((card) => {
      const cardStart = Math.max(card.startDate.getTime(), firstDay)
      const cardStartDate = new Date(cardStart)

      // Находим начальную и конечную колонки для карточки
      const startCol = calendarDays.findIndex(
        (day) =>
          day.getDate() === cardStartDate.getDate() &&
          day.getMonth() === cardStartDate.getMonth() &&
          day.getFullYear() === cardStartDate.getFullYear()
      )

      const endCol = calendarDays.findIndex((day) => {
        const dayEnd = new Date(day)
        dayEnd.setHours(23, 59, 59, 999)
        return dayEnd.getTime() >= card.endDate.getTime()
      })

      // Если карточка не попадает в видимый диапазон, пропускаем
      if (startCol === -1 || endCol === -1) return

      // Находим подходящую строку, где нет пересечений
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        let canFit = true

        for (let j = 0; j < row.length; j++) {
          const existingCard = row[j]
          // Проверяем, пересекается ли текущая карточка с существующей
          if (startCol <= existingCard.endCol && endCol >= existingCard.startCol) {
            canFit = false
            break
          }
        }

        if (canFit) {
          rowIndex = i
          break
        }
      }

      // Если нет подходящей строки, создаем новую
      if (rowIndex === -1) {
        rows.push([{ card, startCol, endCol }])
      } else {
        rows[rowIndex].push({ card, startCol, endCol })
      }
    })

    return {
      distributedCards: rows,
      maxRows: rows.length
    }
  }, [visibleCards, calendarDays])

  // Обработка изменения вида календаря
  useEffect(() => {
    if (onViewModeChange && viewMode !== initialViewMode) {
      onViewModeChange(viewMode)
    }
  }, [viewMode, initialViewMode, onViewModeChange])

  // Обработка изменения даты
  useEffect(() => {
    if (onDateChange && currentDate.getTime() !== initialDate.getTime()) {
      onDateChange(currentDate)
    }
  }, [currentDate, initialDate, onDateChange])

  // Функция перехода к предыдущему периоду
  const handlePrevPeriod = () => {
    const date = new Date(currentDate)
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() - 1)
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - 7)
    } else {
      date.setMonth(date.getMonth() - 6)
    }
    setCurrentDate(date)
  }

  // Функция перехода к следующему периоду
  const handleNextPeriod = () => {
    const date = new Date(currentDate)
    if (viewMode === 'month') {
      date.setMonth(date.getMonth() + 1)
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + 7)
    } else {
      date.setMonth(date.getMonth() + 6)
    }
    setCurrentDate(date)
  }

  // Функция для открытия DatePicker
  const handleOpenDatePicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDatePickerAnchor(event.currentTarget)
    setIsDatePickerOpen(true)
  }

  // Функция обработки выбора даты в DatePicker
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    setIsDatePickerOpen(false)
  }

  // Функция форматирования заголовка в зависимости от режима просмотра
  const formatHeaderTitle = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
    } else if (viewMode === 'week') {
      const endOfWeek = new Date(calendarDays[calendarDays.length - 1])
      return `${formatDate(calendarDays[0])} - ${formatDate(endOfWeek)}`
    } else {
      return `${currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })} - ${new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}`
    }
  }

  // Функция для получения содержимого хинта карточки
  const getCardHintContent = (card: CalendarCard) => (
    <div className="max-w-[300px]">
      <div className="mb-2">
        <h3 className="text-b3-semibold mb-1">{card.title}</h3>
        <p className="text-b4-regular text-mono-700">
          {formatDate(card.startDate)} - {formatDate(card.endDate)}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <Tag>{getFormatLabel(card.format)}</Tag>
        <Tag>{getCategoryLabel(card.category)}</Tag>
        <Tag>{getTypeLabel(card.type)}</Tag>
      </div>
      <p className="text-b4-regular mb-2">{card.description}</p>
      <p className="text-b4-regular text-mono-700">Сотрудник: {card.employee}</p>
    </div>
  )

  // Обработчик клика на карточку
  const handleCardClick = (card: CalendarCard) => {
    if (onCardClick) {
      onCardClick(card)
    }
  }

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Верхняя панель навигации и управления */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPeriod}
            className="p-2 hover:bg-mono-100 rounded-full transition-colors"
          >
            <ChevronLeft />
          </button>

          <button
            className="flex items-center gap-1 px-3 py-1 hover:bg-mono-100 rounded-md transition-colors"
            onClick={handleOpenDatePicker}
          >
            <span className="text-b3-semibold">{formatHeaderTitle()}</span>
            <CalendarTodayOutlined fontSize="small" />
          </button>

          <button
            onClick={handleNextPeriod}
            className="p-2 hover:bg-mono-100 rounded-full transition-colors"
          >
            <ChevronRight />
          </button>

          {isDatePickerOpen && (
            <div className="absolute z-10 mt-40">
              <DatePicker
                value={currentDate}
                onChange={handleDateSelect}
                onClose={() => setIsDatePickerOpen(false)}
              />
            </div>
          )}
        </div>

        <Switch
          options={[
            { id: 'week', label: 'Неделя' },
            { id: 'month', label: 'Месяц' },
            { id: 'half-year', label: 'Полугодие' }
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as CalendarViewMode)}
          size="small"
        />
      </div>

      {/* Календарная сетка */}
      <div
        className={clsx(
          'border border-mono-200 rounded-md overflow-hidden bg-white',
          viewMode === 'half-year' && 'overflow-x-auto'
        )}
      >
        {/* Шапка с номерами дней */}
        <div
          className={clsx('grid gap-px bg-mono-100', viewMode === 'half-year' && 'min-w-max')}
          style={{ gridTemplateColumns: `repeat(${daysToShow}, minmax(50px, 1fr))` }}
        >
          {calendarDays.map((day, index) => (
            <div
              key={`header-${index}`}
              className={clsx(
                'h-10 flex items-center justify-center text-b4-regular bg-mono-50',
                (day.getDay() === 0 || day.getDay() === 6) && 'text-red-600'
              )}
            >
              {day.getDate()}
            </div>
          ))}
        </div>

        {/* Сетка календаря */}
        <div
          className={clsx(
            'overflow-y-auto max-h-[calc(100vh-250px)]',
            viewMode === 'half-year' && 'min-w-max'
          )}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${daysToShow}, minmax(50px, 1fr))`,
            gridTemplateRows: `repeat(${Math.max(1, maxRows)}, minmax(0, auto))`,
            gridGap: '1px',
            background: '#f0f0f0' // Цвет разделителей между ячейками
          }}
        >
          {/* Пустые ячейки (фон) для каждого дня в каждой строке */}
          {Array.from({ length: Math.max(1, maxRows) }).map((_, rowIndex) =>
            calendarDays.map((day, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={clsx(
                  'bg-white',
                  (day.getDay() === 0 || day.getDay() === 6) && 'bg-mono-50'
                )}
                style={{
                  gridColumn: `${colIndex + 1} / span 1`,
                  gridRow: `${rowIndex + 1} / span 1`,
                  minHeight: '100px'
                }}
              />
            ))
          )}

          {/* Ячейки для карточек */}
          {distributedCards.flatMap((row, rowIndex) =>
            row.map(({ card, startCol, endCol }) => {
              const colSpan = endCol - startCol + 1
              const isMinSize = colSpan === 1

              // Определяем контент для карточки в зависимости от её размера
              const showStatus = colSpan > 1
              const showDates = colSpan > 2

              return (
                <Hint
                  key={`card-${card.id}-${rowIndex}`}
                  content={getCardHintContent(card)}
                  position="top-right"
                >
                  <div
                    className={clsx(
                      'bg-white border p-3 flex flex-col cursor-pointer',
                      getStatusColor(card.status),
                      isMinSize ? 'min-h-[80px]' : 'min-h-[100px]'
                    )}
                    style={{
                      gridColumn: `${startCol + 1} / span ${colSpan}`,
                      gridRow: `${rowIndex + 1} / span 1`,
                      margin: '4px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      zIndex: 1 // Чтобы карточки отображались поверх фоновых ячеек
                    }}
                    onClick={() => handleCardClick(card)}
                  >
                    {showStatus && (
                      <div className="text-b5 text-mono-700 mb-1">{getStatusText(card.status)}</div>
                    )}

                    <div
                      className={clsx('font-medium', isMinSize ? 'text-b5' : 'text-b4', 'truncate')}
                    >
                      {card.title}
                    </div>

                    {showDates && (
                      <div className="text-b5 text-mono-600 mt-1">
                        {formatDate(card.startDate)} – {formatDate(card.endDate)}
                      </div>
                    )}
                  </div>
                </Hint>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar
