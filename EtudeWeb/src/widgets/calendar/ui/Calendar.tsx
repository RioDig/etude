import React, { useState, useEffect, useMemo } from 'react'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'
import { Switch } from '@/shared/ui/switch'
import { Hint } from '@/shared/ui/hint'
import { Tag } from '@/shared/ui/tag'
import { CalendarTodayOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import clsx from 'clsx'
import { Badge } from '@/shared/ui/badge'
import { AccessTime } from '@mui/icons-material'
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
      return 'border-yellow-300 bg-yellow-100 hover:bg-yellow-200'
    case 'approved':
      return 'border-green-300 bg-green-100 hover:bg-green-200'
    case 'rejected':
      return 'border-red-300 bg-red-100 hover:bg-red-200'
    case 'completed':
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
    default:
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
  }
}

const getStatusBadgeVariant = (status: CardStatus): 'default' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    case 'completed':
      return 'default'
    default:
      return 'default'
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
    // Получаем начало и конец видимого периода
    const viewStart = new Date(calendarDays[0])
    viewStart.setHours(0, 0, 0, 0)

    const viewEnd = new Date(calendarDays[calendarDays.length - 1])
    viewEnd.setHours(23, 59, 59, 999)

    // Отфильтровываем карточки, попадающие в видимый период
    return cards.filter((card) => {
      const cardStart = new Date(card.startDate)
      const cardEnd = new Date(card.endDate)

      // Карточка видима если:
      // 1. Начало карточки находится в видимом периоде
      // 2. Конец карточки находится в видимом периоде
      // 3. Карточка начинается до видимого периода и заканчивается после него
      return (
        (cardStart >= viewStart && cardStart <= viewEnd) ||
        (cardEnd >= viewStart && cardEnd <= viewEnd) ||
        (cardStart <= viewStart && cardEnd >= viewEnd)
      )
    })
  }, [cards, calendarDays])

  // Алгоритм распределения карточек по строкам
  const { distributedCards, maxRows } = useMemo(() => {
    // Сортируем карточки по длительности (от самых длинных к коротким)
    const sortedCards = [...visibleCards].sort((a, b) => {
      const durationA = a.endDate.getTime() - a.startDate.getTime()
      const durationB = b.endDate.getTime() - b.startDate.getTime()
      return durationB - durationA
    })

    const rows: Array<{ card: CalendarCard; startCol: number; endCol: number }[]> = []

    // Функция для получения индекса дня в календарной сетке
    const getDayIndex = (date: Date): number => {
      const dateTime = date.getTime()

      for (let i = 0; i < calendarDays.length; i++) {
        const dayStart = new Date(calendarDays[i])
        dayStart.setHours(0, 0, 0, 0)

        const dayEnd = new Date(calendarDays[i])
        dayEnd.setHours(23, 59, 59, 999)

        if (dateTime >= dayStart.getTime() && dateTime <= dayEnd.getTime()) {
          return i
        }
      }

      // Если дата раньше первого дня календаря
      if (dateTime < new Date(calendarDays[0]).setHours(0, 0, 0, 0)) {
        return -1
      }

      // Если дата позже последнего дня календаря
      return calendarDays.length
    }

    // Проходим по каждой карточке и определяем её позицию
    sortedCards.forEach((card) => {
      let startCol = getDayIndex(card.startDate)
      let endCol = getDayIndex(card.endDate)

      // Обработка случая, когда начало карточки до первого дня календаря
      if (startCol === -1) startCol = 0

      // Обработка случая, когда конец карточки после последнего дня календаря
      if (endCol >= calendarDays.length) endCol = calendarDays.length - 1

      // Проверка на корректность индексов
      if (startCol > endCol) {
        console.error('Ошибка с индексами карточки:', { card, startCol, endCol })
        // Если карточка имеет неправильные индексы, пропускаем её
        return
      }

      // Находим подходящую строку для карточки
      let rowIndex = -1

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        let canFit = true

        for (const existingCard of row) {
          // Проверяем пересечение с существующими карточками
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

      // Если не нашли подходящую строку, создаем новую
      if (rowIndex === -1) {
        rows.push([{ card, startCol, endCol }])
      } else {
        rows[rowIndex].push({ card, startCol, endCol })
      }
    })

    return {
      distributedCards: rows,
      maxRows: Math.max(1, rows.length)
    }
  }, [visibleCards, calendarDays])

  useEffect(() => {
    if (distributedCards.length > 0) {
      const cardSpans = distributedCards.flatMap((row, rowIndex) =>
        row.map(({ card, startCol, endCol }) => ({
          rowIndex,
          title: card.title,
          startDate: card.startDate.toISOString().split('T')[0],
          endDate: card.endDate.toISOString().split('T')[0],
          startCol,
          endCol,
          span: endCol - startCol + 1,
          shouldSpan:
            Math.ceil((card.endDate.getTime() - card.startDate.getTime()) / (24 * 60 * 60 * 1000)) +
            1
        }))
      )
      console.log('Card spans:', cardSpans)
    }
  }, [distributedCards])

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

  console.log('Rendering calendar with:', {
    distributedCards,
    maxRows
  })

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
          'border border-mono-200 rounded-[8px] overflow-hidden bg-white',
          viewMode === 'half-year' && 'overflow-x-auto'
        )}
      >
        {/* Шапка с номерами дней - обновленные стили */}
        <div
          className="grid bg-mono-50"
          style={{
            gridTemplateColumns: `repeat(${daysToShow}, minmax(50px, 1fr))`,
            borderBottom: '1px solid #E3E3E3' // Mono/200
          }}
        >
          {calendarDays.map((day, index) => (
            <div
              key={`header-${index}`}
              className={clsx(
                'h-[50px] flex items-center px-[16px] py-[12px] text-b1 text-mono-950 justify-center [&:not(:nth-last-child(-n+1))]:border-r-[1px] border-r-mono-200'
                // (day.getDay() === 0 || day.getDay() === 6) && 'text-red-600'
              )}
            >
              {day.getDate()}
            </div>
          ))}
        </div>

        {/* Сетка календаря - без горизонтальных разделителей */}
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${daysToShow}, minmax(50px, 1fr))`,
            gridTemplateRows: `repeat(${Math.max(1, maxRows)}, minmax(100px, auto))`
          }}
        >
          {/* Вертикальные разделители */}
          {Array.from({ length: daysToShow }).map((_, index) => (
            <div
              key={`divider-${index}`}
              className={index !== daysToShow - 1 ? 'border-r border-mono-200' : ''}
              style={{
                gridColumn: index + 1,
                gridRow: '1 / span ' + Math.max(1, maxRows),
                height: '100%'
              }}
            />
          ))}

          {/* Карточки с новыми отступами */}
          {distributedCards.flatMap((row, rowIndex) =>
            row.map(({ card, startCol, endCol }) => {
              const colSpan = endCol - startCol + 1;

              // Определяем, что показывать в зависимости от размера
              const isMinSize = colSpan === 1;       // Только цвет фона
              const showBadge = colSpan > 3;         // Показываем бейдж, если колспан > 2
              const showDates = colSpan > 3;         // Показываем даты, если колспан > 3

              return (
                <div
                  key={`card-${card.id}-${rowIndex}`}
                  style={{
                    gridColumn: `${startCol + 1} / span ${colSpan}`,
                    gridRow: `${rowIndex + 1}`,
                    padding: '8px 16px', // Отступы по вертикали и горизонтали
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  <Hint
                    content={getCardHintContent(card)}
                    position="top-right"
                  >
                    <div
                      className={clsx(
                        'border w-full h-[77px] p-3 flex flex-col cursor-pointer rounded-[8px] transition-colors',
                        getStatusColor(card.status)
                      )}
                      onClick={() => handleCardClick(card)}
                    >
                      {!isMinSize && (
                        <>
                          <div className="flex items-center gap-2 mb-[6px]">
                            {showBadge && (
                              <Badge
                                variant={getStatusBadgeVariant(card.status)}
                                className="whitespace-nowrap shrink-0"
                              >
                                {getStatusText(card.status)}
                              </Badge>
                            )}

                            <div className="text-b2 font-medium text-mono-900 truncate flex-1">
                              {card.title}
                            </div>
                          </div>

                          {showDates && (
                            <div className="flex items-center">
                              <AccessTime className="text-mono-800 shrink-0" style={{ width: 16, height: 16 }} />
                              <span className="ml-2 text-b3-regular text-mono-800 truncate">
                      {formatDate(card.startDate)} – {formatDate(card.endDate)}
                    </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Hint>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar
