import { useState, useEffect } from 'react'

export function useElementSize<T extends HTMLElement>(element: T | null) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!element) return

    const updateSize = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })

    resizeObserver.observe(element)
    updateSize() // Инициализация размеров при первом рендере

    return () => {
      resizeObserver.disconnect()
    }
  }, [element])

  return size
}
