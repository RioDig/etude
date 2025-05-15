import { CalendarCard } from '../model/types'

/**
 * Применяет фильтры к списку карточек календаря
 * @param cards Список карточек для фильтрации
 * @param filters Объект с фильтрами
 * @returns Отфильтрованный список карточек
 */
export const applyFilters = (
  cards: CalendarCard[],
  filters: Record<string, unknown> | null | undefined
): CalendarCard[] => {
  if (!filters) return cards

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== '' && value !== undefined
  )

  if (!hasActiveFilters) return cards

  return cards.filter((card) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === '' || value === undefined) {
        continue
      }

      if (key in card) {
        if (key === 'date' && value instanceof Date) {
          const cardDate = new Date(card.startDate)
          const filterDate = new Date(value)

          if (
            cardDate.getFullYear() !== filterDate.getFullYear() ||
            cardDate.getMonth() !== filterDate.getMonth() ||
            cardDate.getDate() !== filterDate.getDate()
          ) {
            return false
          }
          continue
        }

        if (card[key as keyof CalendarCard] !== value) {
          return false
        }
      }
    }

    return true
  })
}

/**
 * Проверяет, находится ли карточка в заданном диапазоне дат
 * @param card Карточка для проверки
 * @param startDate Начало диапазона
 * @param endDate Конец диапазона
 * @returns true, если карточка попадает в диапазон дат
 */
export const isCardInDateRange = (card: CalendarCard, startDate: Date, endDate: Date): boolean => {
  const cardStart = new Date(card.startDate)
  const cardEnd = new Date(card.endDate)

  return (
    (cardStart >= startDate && cardStart <= endDate) ||
    (cardEnd >= startDate && cardEnd <= endDate) ||
    (cardStart <= startDate && cardEnd >= endDate)
  )
}

/**
 * Проверяет, есть ли активные фильтры
 * @param filters Объект с фильтрами
 * @returns true, если есть хотя бы один активный фильтр
 */
export const hasActiveFilters = (filters: Record<string, unknown> | null | undefined): boolean => {
  if (!filters) return false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(filters).some(([_, value]) => {
    return value !== null && value !== '' && value !== undefined
  })
}
