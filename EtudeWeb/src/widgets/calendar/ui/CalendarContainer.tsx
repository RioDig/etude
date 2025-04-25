import React, { useState } from 'react'
import { Calendar } from './Calendar'
import { Button } from '@/shared/ui/button'
import { Typography } from '@/shared/ui/typography'
import { Add } from '@mui/icons-material'
import { CalendarCard, CalendarViewMode } from '@/widgets/calendar'

interface CalendarContainerProps {
  cards: CalendarCard[]
  onAddCard?: () => void
  initialViewMode?: CalendarViewMode
  initialDate?: Date
  className?: string
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  cards,
  onAddCard,
  initialViewMode = 'month',
  initialDate = new Date(),
  className
}) => {
  const [currentViewMode, setCurrentViewMode] = useState<CalendarViewMode>(initialViewMode)
  const [showLegend, setShowLegend] = useState(true)

  const getStatusText = (status: string): string => {
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

  const getStatusColor = (status: string): string => {
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
        return ''
    }
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
              <div className={`w-4 h-4 rounded ${getStatusColor(status)}`} />
              <span className="text-b4-regular">{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Календарь */}
      <Calendar cards={cards} initialViewMode={currentViewMode} initialDate={initialDate} />
    </div>
  )
}

export default CalendarContainer
