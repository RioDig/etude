import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import { CalendarCardItem } from './CalendarCardItem'
import { CalendarCard, CalendarViewMode } from '../model/types'
import { useElementSize } from '@/shared/hooks/useElementSize'
import { DistributedCard } from '../hooks/useCalendarData'

interface CalendarGridProps {
  days: Date[]
  distributedCards: Array<DistributedCard[]>
  viewMode: CalendarViewMode
  maxRows: number
  onCardClick: (card: CalendarCard) => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  distributedCards,
  viewMode,
  maxRows,
  onCardClick
}) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const { width } = useElementSize(element)

  const ref = useCallback((node: HTMLDivElement | null) => {
    setElement(node)
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="border border-mono-200 rounded-[8px] bg-white h-full flex flex-col overflow-hidden">
      {/* Горизонтальный скролл обёртка */}
      <div className="overflow-x-auto h-full">
        {/* Контейнер с min-width внутри */}
        <div className="h-full flex flex-col min-w-fit">
          {/* Шапка */}
          <div
            className="grid bg-mono-50 sticky top-0 z-10 overflow-y-scroll"
            style={{
              gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))`,
              borderBottom: '1px solid #E3E3E3'
            }}
          >
            {days.map((day, index) => {
              const isToday = day.toDateString() === today.toDateString()

              return (
                <div
                  key={`header-${index}`}
                  className={clsx(
                    'h-[50px] flex items-center px-[16px] py-[12px] text-b1 text-mono-950 justify-center',
                    '[&:not(:nth-last-child(-n+1))]:border-r-[1px] border-r-mono-200',
                    isToday && 'bg-mono-200'
                  )}
                >
                  {day.getDate()}
                </div>
              )
            })}
          </div>

          {/* Контент с вертикальным скроллом */}
          <div className="overflow-y-auto flex-1">
            <div
              className="relative"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))`,
                gridTemplateRows: `repeat(${Math.max(1, maxRows)}, 100px) auto`,
                minHeight: '100%'
              }}
              ref={ref}
            >
              {/* Вертикальные делители */}
              {Array.from({ length: days.length }).map((_, index) => {
                const isToday = days[index] && days[index].toDateString() === today.toDateString()

                return (
                  <div
                    key={`divider-${index}`}
                    className={clsx(
                      index !== days.length - 1 ? 'border-r border-mono-200' : '',
                      isToday ? 'bg-mono-200' : ''
                    )}
                    style={{
                      gridColumn: index + 1,
                      gridRow: '1 / span ' + Math.max(1, maxRows + 1)
                    }}
                  />
                )
              })}

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
                      viewMode={viewMode}
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
      </div>
    </div>
  )
}
