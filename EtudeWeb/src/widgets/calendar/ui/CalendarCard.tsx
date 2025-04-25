import React from 'react'
import clsx from 'clsx'
import { Hint } from '@/shared/ui/hint'
import { Tag } from '@/shared/ui/tag'
import { CardStatus } from '@/widgets/calendar'

interface CalendarCardProps {
  id: string
  title: string
  status: CardStatus
  startDate: Date
  endDate: Date
  description: string
  employee: string
  format: 'offline' | 'online' | 'mixed'
  category: 'hard-skills' | 'soft-skills' | 'management'
  type: 'course' | 'conference' | 'webinar' | 'training'
  colSpan: number
  style: React.CSSProperties
}

// Вспомогательные функции
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

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

export const CalendarCardItem: React.FC<CalendarCardProps> = ({
  id,
  title,
  status,
  startDate,
  endDate,
  description,
  employee,
  format,
  category,
  type,
  colSpan,
  style
}) => {
  const isMinSize = colSpan === 1
  const showStatus = colSpan > 1
  const showDates = colSpan > 2

  // Содержимое хинта для карточки
  const hintContent = (
    <div className="max-w-[300px]">
      <div className="mb-2">
        <h3 className="text-b3-semibold mb-1">{title}</h3>
        <p className="text-b4-regular text-mono-700">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <Tag>{getFormatLabel(format)}</Tag>
        <Tag>{getCategoryLabel(category)}</Tag>
        <Tag>{getTypeLabel(type)}</Tag>
      </div>
      <p className="text-b4-regular mb-2">{description}</p>
      <p className="text-b4-regular text-mono-700">Сотрудник: {employee}</p>
    </div>
  )

  return (
    <Hint content={hintContent} position="top-right">
      <div
        className={clsx(
          'bg-white border p-3 flex flex-col',
          getStatusColor(status),
          isMinSize ? 'min-h-[80px]' : 'min-h-[100px]'
        )}
        style={style}
      >
        {showStatus && <div className="text-b5 text-mono-700 mb-1">{getStatusText(status)}</div>}

        <div className={clsx('font-medium', isMinSize ? 'text-b5' : 'text-b4', 'truncate')}>
          {title}
        </div>

        {showDates && (
          <div className="text-b5 text-mono-600 mt-1">
            {formatDate(startDate)} – {formatDate(endDate)}
          </div>
        )}
      </div>
    </Hint>
  )
}

export default CalendarCardItem
