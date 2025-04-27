// src/widgets/calendar/ui/CalendarGrid.tsx
import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import { CalendarCardItem } from './CalendarCardItem'
import { CalendarCard } from '../model/types'
import { useElementSize } from '@/shared/hooks/useElementSize'
import { DistributedCard } from '../hooks/useCalendarData'

interface CalendarGridProps {
  days: Date[]
  distributedCards: Array<DistributedCard[]>
  maxRows: number
  onCardClick: (card: CalendarCard) => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  distributedCards,
  maxRows,
  onCardClick
}) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const { width } = useElementSize(element)

  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node)
  }, [])

  return (
    <div className="border border-mono-200 rounded-[8px] overflow-auto bg-white">
      <div
        style={{
          width: 'fit-content',
          minWidth: '100%'
        }}
      >
        {/* Шапка с номерами дней */}
        <div
          className="grid bg-mono-50"
          style={{
            gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))`,
            borderBottom: '1px solid #E3E3E3'
          }}
          ref={ref}
        >
          {days.map((day, index) => (
            <div
              key={`header-${index}`}
              className={clsx(
                'h-[50px] flex items-center px-[16px] py-[12px] text-b1 text-mono-950 justify-center',
                '[&:not(:nth-last-child(-n+1))]:border-r-[1px] border-r-mono-200'
              )}
            >
              {day.getDate()}
            </div>
          ))}
        </div>

        {/* Сетка календаря */}
        <div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))`,
            gridTemplateRows: `repeat(${Math.max(1, maxRows)}, minmax(100px, auto))`
          }}
        >
          {/* Вертикальные разделители */}
          {Array.from({ length: days.length }).map((_, index) => (
            <div
              key={`divider-${index}`}
              className={index !== days.length - 1 ? 'border-r border-mono-200' : ''}
              style={{
                gridColumn: index + 1,
                gridRow: '1 / span ' + Math.max(1, maxRows),
                height: '100%'
              }}
            />
          ))}

          {/* Карточки */}
          {distributedCards.flatMap((row, rowIndex) =>
            row.map(({ card, startCol, endCol, isStartExtending, isEndExtending }) => {
              const colSpan = endCol - startCol + 1
              const colWidth = width / days.length

              return (
                <CalendarCardItem
                  key={`card-${card.id}-${rowIndex}`}
                  card={card}
                  colSpan={colSpan}
                  colWidth={colWidth}
                  isStartExtending={isStartExtending}
                  isEndExtending={isEndExtending}
                  style={{
                    gridColumn: `${startCol + 1} / span ${colSpan}`,
                    gridRow: `${rowIndex + 1}`,
                    position: 'relative',
                    zIndex: 10
                  }}
                  onClick={onCardClick}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
