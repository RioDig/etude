// src/widgets/calendar/hooks/useCalendarData.ts
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
  filters?: Record<string, any> // Добавлен опциональный параметр для фильтров
) => {
  // Количество дней для отображения
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

  // Функция фильтрации карточек на основе переданных фильтров
  const filterCards = (cards: CalendarCard[]) => {
    if (!filters) return cards

    return cards.filter((card) => {
      // Проверяем каждый фильтр
      for (const [key, value] of Object.entries(filters)) {
        // Если значение фильтра пустое или равно дефолтному, пропускаем его
        if (!value || value === '' || value === 'Все') continue

        // Для разных свойств применяем разные проверки
        if (key in card) {
          // Простое сравнение для строковых фильтров
          if (card[key as keyof CalendarCard] !== value) {
            return false
          }
        }
      }

      return true
    })
  }

  // Распределение карточек по отображаемым дням
  const visibleCards = useMemo(() => {
    // Получаем начало и конец видимого периода
    const viewStart = new Date(calendarDays[0])
    viewStart.setHours(0, 0, 0, 0)

    const viewEnd = new Date(calendarDays[calendarDays.length - 1])
    viewEnd.setHours(23, 59, 59, 999)

    // Сначала применяем пользовательские фильтры
    const filteredCards = filters ? filterCards(cards) : cards

    // Отфильтровываем карточки, попадающие в видимый период
    return filteredCards.filter((card) => {
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
  }, [cards, calendarDays, filters])

  // Алгоритм распределения карточек по строкам
  const { distributedCards, maxRows } = useMemo(() => {
    // Сортировка карточек для разных стратегий размещения
    const sortedCards = [...visibleCards]

    // Разделяем карточки на новые (начинающиеся в текущем периоде)
    // и продолжающиеся (начались раньше)
    const continuingCards = sortedCards.filter((card) => {
      // Карточка начинается до первого дня текущего периода
      const firstDayStart = new Date(calendarDays[0])
      firstDayStart.setHours(0, 0, 0, 0)
      return card.startDate.getTime() < firstDayStart.getTime()
    })

    const newCards = sortedCards.filter((card) => !continuingCards.includes(card))

    // Сортируем новые карточки по времени начала и длительности
    newCards.sort((a, b) => {
      // Сначала сортируем по времени начала
      const startTimeA = a.startDate.getTime()
      const startTimeB = b.startDate.getTime()

      if (startTimeA !== startTimeB) {
        return startTimeA - startTimeB // Сначала более ранние события
      }

      // При одинаковом времени начала сортируем по длительности
      const durationA = a.endDate.getTime() - a.startDate.getTime()
      const durationB = b.endDate.getTime() - b.startDate.getTime()
      return durationB - durationA // Длинные события выше
    })

    // Сортируем продолжающиеся карточки по их существующим строкам
    continuingCards.sort((a, b) => {
      const rowA =
        cardRowMapRef.current[a.id] !== undefined ? cardRowMapRef.current[a.id] : Infinity
      const rowB =
        cardRowMapRef.current[b.id] !== undefined ? cardRowMapRef.current[b.id] : Infinity
      return rowA - rowB // Сохраняем порядок строк
    })

    // Используем сохраненную информацию о строках из ref
    const cardRowMap = cardRowMapRef.current

    const rows: Array<DistributedCard[]> = []

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

    // Функция для определения, выходит ли карточка за границы видимой области
    const isCardExtendingOutside = (card: CalendarCard, position: 'start' | 'end'): boolean => {
      if (position === 'start') {
        // Проверяем, начинается ли карточка раньше первого дня в сетке
        const firstDayStart = new Date(calendarDays[0])
        firstDayStart.setHours(0, 0, 0, 0)
        return card.startDate.getTime() < firstDayStart.getTime()
      } else {
        // Проверяем, заканчивается ли карточка позже последнего дня в сетке
        const lastDayEnd = new Date(calendarDays[calendarDays.length - 1])
        lastDayEnd.setHours(23, 59, 59, 999)
        return card.endDate.getTime() > lastDayEnd.getTime()
      }
    }

    // Обрабатываем сначала продолжающиеся карточки, чтобы они сохраняли свой порядок
    // при переходе на новый период
    continuingCards.forEach((card) => {
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

      // Определяем, выходит ли карточка за пределы видимой области
      const isStartExtending = isCardExtendingOutside(card, 'start')
      const isEndExtending = isCardExtendingOutside(card, 'end')

      // Сохраняем эту информацию вместе с карточкой
      const cardData: DistributedCard = {
        card,
        startCol,
        endCol,
        isStartExtending,
        isEndExtending
      }

      // Проверяем, назначена ли уже карточка на определенную строку
      let rowIndex = -1

      // Если для этой карточки уже есть назначенная строка, пытаемся использовать её
      if (cardRowMap[card.id] !== undefined) {
        const preferredRowIndex = cardRowMap[card.id]

        // Проверяем, можно ли разместить карточку в предпочтительной строке
        if (preferredRowIndex < rows.length) {
          const row = rows[preferredRowIndex]
          let canFit = true

          for (const existingCard of row) {
            // Проверяем пересечение с существующими карточками
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

      // Если не удалось использовать предпочтительную строку, ищем любую подходящую
      if (rowIndex === -1) {
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
      }

      // Если не нашли подходящую строку, создаем новую
      if (rowIndex === -1) {
        rowIndex = rows.length
        rows.push([cardData])
      } else {
        rows[rowIndex].push(cardData)
      }

      // Сохраняем индекс строки для этой карточки
      cardRowMap[card.id] = rowIndex
    })

    // Затем обрабатываем новые карточки
    newCards.forEach((card) => {
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

      // Определяем, выходит ли карточка за пределы видимой области
      const isStartExtending = isCardExtendingOutside(card, 'start')
      const isEndExtending = isCardExtendingOutside(card, 'end')

      // Сохраняем эту информацию вместе с карточкой
      const cardData: DistributedCard = {
        card,
        startCol,
        endCol,
        isStartExtending,
        isEndExtending
      }

      // Ищем подходящую строку, начиная с верхней
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
        rowIndex = rows.length
        rows.push([cardData])
      } else {
        rows[rowIndex].push(cardData)
      }

      // Сохраняем индекс строки для этой карточки
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
