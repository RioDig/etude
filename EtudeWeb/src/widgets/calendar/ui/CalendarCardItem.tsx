// src/widgets/calendar/ui/CalendarCardItem.tsx
import React from 'react'
import clsx from 'clsx'
import { AccessTime } from '@mui/icons-material'
import { Hint } from '@/shared/ui/hint'
import { Badge } from '@/shared/ui/badge'
import { Tag } from '@/shared/ui/tag'
import { CalendarCard, CalendarViewMode } from '../model/types'
import {
  formatDate,
  getStatusColor,
  getStatusBadgeVariant,
  getStatusText,
  getFormatLabel,
  getCategoryLabel,
  getTypeLabel
} from '../utils/calendar-helpers'

interface CalendarCardItemProps {
  card: CalendarCard
  colSpan: number
  colWidth: number
  isStartExtending: boolean
  isEndExtending: boolean
  viewMode: CalendarViewMode
  style: React.CSSProperties
  onClick: (card: CalendarCard) => void
}

export const CalendarCardItem: React.FC<CalendarCardItemProps> = ({
  card,
  colSpan,
  colWidth,
  isStartExtending,
  isEndExtending,
  viewMode,
  style,
  onClick
}) => {
  // Определяем, что показывать в зависимости от размера
  const isMinSize = colSpan === 1 && viewMode !== 'week'
  const showBadge = (colSpan > 1 || viewMode === 'week') && colWidth * colSpan > 350
  const showDates = colWidth * colSpan > 250

  // Содержимое хинта для карточки
  const hintContent = (
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

  return (
    <div
      style={style}
      className={clsx(
        'pt-2 pb-2',
        !isStartExtending ? 'pl-3' : 'pl-0',
        !isEndExtending ? 'pr-3' : 'pr-0'
      )}
    >
      <Hint content={hintContent} position="top-right">
        <div
          className={clsx(
            'border w-full h-[77px] flex flex-col cursor-pointer transition-colors',
            getStatusColor(card.status),
            // Применяем скругление углов только для тех сторон, которые не выходят за границы
            'rounded-none',
            !isStartExtending ? 'rounded-l-[8px]' : '',
            !isEndExtending ? 'rounded-r-[8px]' : '',
            'pl-3 pr-3 pt-3 pb-3'
          )}
          onClick={() => onClick(card)}
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
                  <AccessTime
                    className="text-mono-800 shrink-0"
                    style={{ width: 16, height: 16 }}
                  />
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
  )
}
