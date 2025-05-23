import React, { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { Tag } from '@/shared/ui/tag'
import { createPortal } from 'react-dom'

export type HintPosition =
  | 'default'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right'
  | 'bottom'

export interface HintProps {
  /**
   * Триггер для показа подсказки (любой элемент интерфейса)
   */
  children: React.ReactNode

  /**
   * Основное содержимое подсказки
   */
  content: React.ReactNode

  /**
   * Дополнительное описание (серым цветом)
   */
  description?: React.ReactNode

  /**
   * Label в виде тега вверху подсказки
   * Может быть строкой, React элементом, или массивом для нескольких тегов
   */
  label?: React.ReactNode | React.ReactNode[]

  /**
   * Кнопка или кнопки в нижней части подсказки
   */
  actions?: React.ReactNode

  /**
   * Фиксированная позиция подсказки
   * Если не указана, позиция будет определяться автоматически
   */
  position?: HintPosition

  /**
   * Задержка перед показом и скрытием подсказки в миллисекундах
   * @default 100
   */
  delay?: number

  /**
   * Дополнительные CSS классы для контейнера подсказки
   */
  className?: string

  /**
   * Показывать ли подсказку для disabled элементов
   * @default true
   */
  showForDisabled?: boolean

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент Hint - отображает всплывающую подсказку при наведении на триггер.
 * Подсказка может содержать тег-метку, основной текст, описание и действия.
 *
 * Появляется при наведении курсора с задержкой 100мс.
 * По умолчанию отображается в правом нижнем углу курсора.
 */
export const Hint: React.FC<HintProps> = ({
  children,
  content,
  description,
  label,
  actions,
  position,
  delay = 100,
  className,
  // showForDisabled = true,
  testId = 'hint'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hintPosition, setHintPosition] = useState<HintPosition>(position || 'bottom-right')
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [initialCalculated, setInitialCalculated] = useState(false)

  const triggerRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const calculatePosition = useCallback(
    (event: MouseEvent): void => {
      if (initialCalculated && isVisible) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const cursorX = event.clientX
      const cursorY = event.clientY

      const minHintWidth = 300
      const minHintHeight = 200

      const rightSpace = viewportWidth - cursorX
      const bottomSpace = viewportHeight - cursorY
      // const leftSpace = cursorX;
      // const topSpace = cursorY;

      if (position) {
        setHintPosition(position)
      } else {
        if (bottomSpace < minHintHeight) {
          if (rightSpace < minHintWidth) {
            setHintPosition('top-left')
          } else {
            setHintPosition('top-right')
          }
        } else {
          if (rightSpace < minHintWidth) {
            setHintPosition('bottom-left')
          } else {
            setHintPosition('bottom-right')
          }
        }
      }

      setCoords({
        x: cursorX,
        y: cursorY
      })

      setInitialCalculated(true)
    },
    [initialCalculated, isVisible, position]
  )

  const getHintStyles = (): React.CSSProperties => {
    const offset = 10

    switch (hintPosition) {
      case 'top-left':
        return {
          left: `${coords.x - offset}px`,
          top: `${coords.y - offset}px`,
          transform: 'translate(-100%, -100%)'
        }
      case 'top-right':
        return {
          left: `${coords.x + offset}px`,
          top: `${coords.y - offset}px`,
          transform: 'translateY(-100%)'
        }
      case 'bottom-left':
        return {
          left: `${coords.x - offset}px`,
          top: `${coords.y + offset}px`,
          transform: 'translateX(-100%)'
        }
      case 'bottom-right':
        return {
          left: `${coords.x + offset}px`,
          top: `${coords.y + offset}px`
        }
      case 'left':
        return {
          left: `${coords.x - offset}px`,
          top: `${coords.y}px`,
          transform: 'translate(-100%, -50%)'
        }
      case 'right':
        return {
          left: `${coords.x + offset}px`,
          top: `${coords.y}px`,
          transform: 'translateY(-50%)'
        }
      case 'bottom':
        return {
          left: `${coords.x}px`,
          top: `${coords.y + offset}px`,
          transform: 'translateX(-50%)'
        }
      default:
        return {
          left: `${coords.x + offset}px`,
          top: `${coords.y + offset}px`
        }
    }
  }

  const handleMouseEnter = (event: React.MouseEvent): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!initialCalculated) {
      calculatePosition(event.nativeEvent)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)

      setInitialCalculated(false)
    }, delay)
  }

  const handleTriggerClick = (event: React.MouseEvent): void => {
    if (isVisible) {
      setIsVisible(false)
      setInitialCalculated(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    calculatePosition(event.nativeEvent)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        isVisible &&
        hintRef.current &&
        triggerRef.current &&
        !hintRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
        setInitialCalculated(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false)
        setInitialCalculated(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = (): void => {
      if (isVisible) {
        setIsVisible(false)
        setInitialCalculated(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  return (
    <div className="relative " data-testid={`${testId}-container`}>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTriggerClick}
        className="cursor-pointer"
        data-testid={`${testId}-trigger`}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={hintRef}
            className={clsx(
              'fixed z-[1000] flex flex-col items-start gap-3 p-3 max-w-[520px]',
              'rounded-[6px] bg-white shadow-[0px_0px_13px_0px_rgba(0,0,0,0.06)]',
              'animate-[fadeIn_100ms_ease-in]',
              className
            )}
            style={getHintStyles()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid={`${testId}-content`}
            role="tooltip"
          >
            {label && (
              <div data-testid={`${testId}-label`} className="self-start flex flex-wrap gap-2">
                {Array.isArray(label) ? (
                  label.map((item, index) => (
                    <React.Fragment key={index}>
                      {typeof item === 'string' ? <Tag>{item}</Tag> : item}
                    </React.Fragment>
                  ))
                ) : typeof label === 'string' ? (
                  <Tag>{label}</Tag>
                ) : (
                  label
                )}
              </div>
            )}

            {content && (
              <div
                className="text-mono-950 text-b4-regular self-start text-left w-full"
                data-testid={`${testId}-main-text`}
              >
                {content}
              </div>
            )}

            {description && (
              <div
                className="text-mono-800 text-b4-regular self-start text-left w-full"
                data-testid={`${testId}-description`}
              >
                {description}
              </div>
            )}

            {actions && (
              <div className="flex items-center gap-2 self-start" data-testid={`${testId}-actions`}>
                {actions}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

export default Hint
