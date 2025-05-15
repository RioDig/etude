import { useMemo } from 'react'
import { CalendarCard, CalendarViewMode } from '../model/types'
import { generateCalendarDays } from '../utils/calendar-helpers'

export interface DistributedCard {
  card: CalendarCard
  startCol: number
  endCol: number
  isStartExtending: boolean
  isEndExtending: boolean
}

export const useCalendarData = (
  cards: CalendarCard[],
  viewMode: CalendarViewMode,
  currentDate: Date,
  cardRowMapRef: React.MutableRefObject<Record<string, number>>,
  filters?: Record<string, unknown>
) => {
  const daysToShow = useMemo(() => {
    switch (viewMode) {
      case 'week':
        return 7
      case 'month': {
        const date = new Date(currentDate)
        date.setDate(1)
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      }
      case 'half-year':
        return 30
      default:
        return 30
    }
  }, [viewMode, currentDate])

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

  const calendarDays = useMemo(() => {
    return generateCalendarDays(startDay, daysToShow)
  }, [startDay, daysToShow])

  const filterCards = (cards: CalendarCard[]) => {
    if (!filters) return cards

    return cards.filter((card) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value || value === '' || value === 'Все') continue

        if (key in card) {
          if (card[key as keyof CalendarCard] !== value) {
            return false
          }
        }
      }

      return true
    })
  }

  const visibleCards = useMemo(() => {
    const viewStart = new Date(calendarDays[0])
    viewStart.setHours(0, 0, 0, 0)

    const viewEnd = new Date(calendarDays[calendarDays.length - 1])
    viewEnd.setHours(23, 59, 59, 999)

    const filteredCards = filters ? filterCards(cards) : cards

    return filteredCards.filter((card) => {
      const cardStart = new Date(card.startDate)
      const cardEnd = new Date(card.endDate)

      return (
        (cardStart >= viewStart && cardStart <= viewEnd) ||
        (cardEnd >= viewStart && cardEnd <= viewEnd) ||
        (cardStart <= viewStart && cardEnd >= viewEnd)
      )
    })
  }, [cards, calendarDays, filters])

  const { distributedCards, maxRows } = useMemo(() => {
    const sortedCards = [...visibleCards]

    const continuingCards = sortedCards.filter((card) => {
      const firstDayStart = new Date(calendarDays[0])
      firstDayStart.setHours(0, 0, 0, 0)
      return card.startDate.getTime() < firstDayStart.getTime()
    })

    const newCards = sortedCards.filter((card) => !continuingCards.includes(card))

    newCards.sort((a, b) => {
      const startTimeA = a.startDate.getTime()
      const startTimeB = b.startDate.getTime()

      if (startTimeA !== startTimeB) {
        return startTimeA - startTimeB
      }

      const durationA = a.endDate.getTime() - a.startDate.getTime()
      const durationB = b.endDate.getTime() - b.startDate.getTime()
      return durationB - durationA
    })

    continuingCards.sort((a, b) => {
      const rowA =
        cardRowMapRef.current[a.id] !== undefined ? cardRowMapRef.current[a.id] : Infinity
      const rowB =
        cardRowMapRef.current[b.id] !== undefined ? cardRowMapRef.current[b.id] : Infinity
      return rowA - rowB
    })

    const cardRowMap = cardRowMapRef.current

    const rows: Array<DistributedCard[]> = []

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

      if (dateTime < new Date(calendarDays[0]).setHours(0, 0, 0, 0)) {
        return -1
      }

      return calendarDays.length
    }

    const isCardExtendingOutside = (card: CalendarCard, position: 'start' | 'end'): boolean => {
      if (position === 'start') {
        const firstDayStart = new Date(calendarDays[0])
        firstDayStart.setHours(0, 0, 0, 0)
        return card.startDate.getTime() < firstDayStart.getTime()
      } else {
        const lastDayEnd = new Date(calendarDays[calendarDays.length - 1])
        lastDayEnd.setHours(23, 59, 59, 999)
        return card.endDate.getTime() > lastDayEnd.getTime()
      }
    }

    continuingCards.forEach((card) => {
      let startCol = getDayIndex(card.startDate)
      let endCol = getDayIndex(card.endDate)

      if (startCol === -1) startCol = 0

      if (endCol >= calendarDays.length) endCol = calendarDays.length - 1

      if (startCol > endCol) {
        console.error('Ошибка с индексами карточки:', { card, startCol, endCol })

        return
      }

      const isStartExtending = isCardExtendingOutside(card, 'start')
      const isEndExtending = isCardExtendingOutside(card, 'end')

      const cardData: DistributedCard = {
        card,
        startCol,
        endCol,
        isStartExtending,
        isEndExtending
      }

      let rowIndex = -1

      if (cardRowMap[card.id] !== undefined) {
        const preferredRowIndex = cardRowMap[card.id]

        if (preferredRowIndex < rows.length) {
          const row = rows[preferredRowIndex]
          let canFit = true

          for (const existingCard of row) {
            if (startCol <= existingCard.endCol && endCol >= existingCard.startCol) {
              canFit = false
              break
            }
          }

          if (canFit) {
            rowIndex = preferredRowIndex
          }
        }
      }

      if (rowIndex === -1) {
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          let canFit = true

          for (const existingCard of row) {
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
      }

      if (rowIndex === -1) {
        rowIndex = rows.length
        rows.push([cardData])
      } else {
        rows[rowIndex].push(cardData)
      }

      cardRowMap[card.id] = rowIndex
    })

    newCards.forEach((card) => {
      let startCol = getDayIndex(card.startDate)
      let endCol = getDayIndex(card.endDate)

      if (startCol === -1) startCol = 0

      if (endCol >= calendarDays.length) endCol = calendarDays.length - 1

      if (startCol > endCol) {
        console.error('Ошибка с индексами карточки:', { card, startCol, endCol })

        return
      }

      const isStartExtending = isCardExtendingOutside(card, 'start')
      const isEndExtending = isCardExtendingOutside(card, 'end')

      const cardData: DistributedCard = {
        card,
        startCol,
        endCol,
        isStartExtending,
        isEndExtending
      }

      let rowIndex = -1
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        let canFit = true

        for (const existingCard of row) {
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

      if (rowIndex === -1) {
        rowIndex = rows.length
        rows.push([cardData])
      } else {
        rows[rowIndex].push(cardData)
      }

      cardRowMap[card.id] = rowIndex
    })

    return {
      distributedCards: rows,
      maxRows: Math.max(1, rows.length)
    }
  }, [visibleCards, cardRowMapRef, calendarDays])

  return {
    daysToShow,
    startDay,
    calendarDays,
    visibleCards,
    distributedCards,
    maxRows
  }
}
