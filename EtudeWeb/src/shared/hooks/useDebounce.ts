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
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
