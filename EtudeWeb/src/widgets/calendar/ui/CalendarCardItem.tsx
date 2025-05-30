import React from 'react'
import clsx from 'clsx'
import { AccessTime } from '@mui/icons-material'
import { Hint } from '@/shared/ui/hint'
import { Badge } from '@/shared/ui/badge'
import { Tag } from '@/shared/ui/tag'
import { CalendarCard, CalendarViewMode } from '../model/types'
import { formatDate, getStatusColor } from '../utils/calendar-helpers'
import { CourseFormatLabels } from '@/shared/labels/courseFormat.ts'
import { CourseTypeLabels } from '@/shared/labels/courseType.ts'
import { StatusTypeLabels } from '@/shared/labels/statusType.ts'
import { StatusType } from '@/shared/types'

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
  const isMinSize = colSpan === 1 && viewMode !== 'week'
  const showBadge = (colSpan > 1 || viewMode === 'week') && colWidth * colSpan > 350
  const showDates = colWidth * colSpan > 250

  const getStatusVariant = (status: string) => {
    switch (status) {
      case StatusType.Confirmation:
        return 'default'
      case StatusType.Approvement:
        return 'warning'
      case StatusType.Rejected:
        return 'error'
      case StatusType.Registered:
        return 'success'
      case StatusType.Processed:
        return 'system'
      default:
        return 'default'
    }
  }

  const hintContent = (
    <div className="max-w-[300px]">
      {card.status && (
        <Badge variant={getStatusVariant(card.status)} className="mb-2">
          {StatusTypeLabels[card.status]}
        </Badge>
      )}
      <div className="mb-2">
        <h3 className="text-b3-semibold mb-1">{card.title}</h3>
        <p className="text-b4-regular text-mono-700">
          {formatDate(card.startDate)} - {formatDate(card.endDate)}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <Tag>{CourseFormatLabels[card.format]}</Tag>
        <Tag>{card.track}</Tag>
        <Tag>{CourseTypeLabels[card.type]}</Tag>
      </div>
      <p className="text-b4-regular mb-2">{card.description}</p>
      {card.trainingCenter && (
        <p className="text-b4-regular text-mono-700">Учебный центр: {card.trainingCenter}</p>
      )}
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
                {card.status && showBadge && (
                  <Badge
                    variant={getStatusVariant(card.status)}
                    className="whitespace-nowrap shrink-0"
                  >
                    {StatusTypeLabels[card.status]}
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
