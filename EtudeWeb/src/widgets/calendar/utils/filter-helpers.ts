// src/widgets/calendar/utils/filter-helpers.ts
import { CalendarCard } from '../model/types'

/**
 * Применяет фильтры к списку карточек календаря
 * @param cards Список карточек для фильтрации
 * @param filters Объект с фильтрами
 * @returns Отфильтрованный список карточек
 */
export const applyFilters = (
  cards: CalendarCard[],
  filters: Record<string, any> | null | undefined
): CalendarCard[] => {
  // Если фильтры не определены или пусты, возвращаем все карточки
  if (!filters) return cards

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== null && value !== '' && value !== undefined
  )

  if (!hasActiveFilters) return cards

  // Применяем фильтры
  return cards.filter((card) => {
    // Проверяем каждый фильтр
    for (const [key, value] of Object.entries(filters)) {
      // Пропускаем пустые фильтры
      if (value === null || value === '' || value === undefined) {
        continue
      }

      // Проверяем свойство карточки
      if (key in card) {
        // Особая обработка для даты
        if (key === 'date' && value instanceof Date) {
          const cardDate = new Date(card.startDate)
          const filterDate = new Date(value)

          // Сравниваем только даты без времени
          if (
            cardDate.getFullYear() !== filterDate.getFullYear() ||
            cardDate.getMonth() !== filterDate.getMonth() ||
            cardDate.getDate() !== filterDate.getDate()
          ) {
            return false
          }
          continue
        }

        // Обычное сравнение для других свойств
        if (card[key as keyof CalendarCard] !== value) {
          return false
        }
      }
    }

    // Если карточка прошла все фильтры, включаем её
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

  // Карточка видима, если:
  // 1. Начало карточки находится в диапазоне
  // 2. Конец карточки находится в диапазоне
  // 3. Карточка охватывает весь диапазон
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
export const hasActiveFilters = (filters: Record<string, any> | null | undefined): boolean => {
  if (!filters) return false

  return Object.entries(filters).some(([_, value]) => {
    return value !== null && value !== '' && value !== undefined
  })
}
