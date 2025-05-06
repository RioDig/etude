// src/shared/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

/**
 * Хук для создания отложенного (debounced) значения
 * @param value Значение для задержки
 * @param delay Время задержки в миллисекундах
 * @returns Отложенное значение
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Устанавливаем таймер для обновления отложенного значения
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Очищаем таймер при изменении значения
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
