// src/widgets/calendar/ui/CalendarContainer.tsx
import React, { useState } from 'react'
import { Calendar } from './Calendar'
import { Button } from '@/shared/ui/button'
import { Typography } from '@/shared/ui/typography'
import { Add } from '@mui/icons-material'
import { CalendarCard, CalendarViewMode, CardStatus } from '../model/types'
import { getStatusText, getStatusColor } from '../utils/calendar-helpers'

interface CalendarContainerProps {
  /**
   * Массив карточек для отображения в календаре
   */
  cards: CalendarCard[]

  /**
   * Обработчик добавления новой карточки
   */
  onAddCard?: () => void

  /**
   * Обработчик клика по карточке
   */
  onCardClick?: (card: CalendarCard) => void

  /**
   * Начальный режим отображения
   * @default 'month'
   */
  initialViewMode?: CalendarViewMode

  /**
   * Начальная дата для отображения
   * @default new Date()
   */
  initialDate?: Date

  /**
   * Дополнительные классы
   */
  className?: string
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  cards,
  onAddCard,
  onCardClick,
  initialViewMode = 'month',
  initialDate = new Date(),
  className
}) => {
  // Состояние для отображения легенды статусов
  const [showLegend, setShowLegend] = useState(true)

  // Состояние для текущего режима отображения и текущей даты
  const [currentViewMode, setCurrentViewMode] = useState<CalendarViewMode>(initialViewMode)
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)

  // Обработчик изменения режима отображения
  const handleViewModeChange = (mode: CalendarViewMode) => {
    setCurrentViewMode(mode)
  }

  // Обработчик изменения даты
  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  return (
    <div className={className}>
      {/* Верхняя панель с заголовком и кнопками управления */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h2">Календарь обучения</Typography>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? 'Скрыть легенду' : 'Показать легенду'}
          </Button>

          {onAddCard && (
            <Button variant="primary" leftIcon={<Add />} onClick={onAddCard}>
              Добавить курс
            </Button>
          )}
        </div>
      </div>

      {/* Легенда статусов */}
      {showLegend && (
        <div className="flex gap-4 mb-4 p-4 bg-white rounded-md shadow-sm">
          <Typography variant="b3Semibold" className="mr-2">
            Статусы:
          </Typography>

          {['pending', 'approved', 'rejected', 'completed'].map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded ${getStatusColor(status as CardStatus).split(' ')[0]} ${getStatusColor(status as CardStatus).split(' ')[1]}`}
              />
              <span className="text-b4-regular">{getStatusText(status as CardStatus)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Календарь */}
      <Calendar
        cards={cards}
        initialViewMode={currentViewMode}
        initialDate={currentDate}
        onViewModeChange={handleViewModeChange}
        onDateChange={handleDateChange}
        onCardClick={onCardClick}
      />
    </div>
  )
}

export default CalendarContainer
