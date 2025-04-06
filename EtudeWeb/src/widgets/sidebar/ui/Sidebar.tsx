import React, { ReactNode, useEffect, useState, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { Close, MoreHoriz } from '@mui/icons-material'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'

export interface SidebarAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'third'
  disabled?: boolean
}

export interface SidebarProps {
  /**
   * Флаг открытия сайдбара
   */
  open: boolean

  /**
   * Обработчик закрытия сайдбара
   */
  onClose: () => void

  /**
   * Заголовок сайдбара
   */
  title: string

  /**
   * Описание сайдбара (опционально)
   */
  description?: string

  /**
   * Бейдж в хедере (опционально)
   */
  badge?: {
    text: string
    variant?: 'default' | 'error' | 'warning' | 'success' | 'system'
  }

  /**
   * Действия в хедере (кнопки)
   */
  headerActions?: SidebarAction[]

  /**
   * Действия в футере (кнопки)
   */
  footerActions?: SidebarAction[]

  /**
   * Основное содержимое сайдбара
   */
  children: ReactNode

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент Sidebar - боковая панель, открывающаяся справа
 */
// Компонент для контейнера с кнопками действий в хедере
interface HeaderActionsContainerProps {
  actions: SidebarAction[]
}

const HeaderActionsContainer: React.FC<HeaderActionsContainerProps> = ({ actions }) => {
  const [visibleActions, setVisibleActions] = useState<SidebarAction[]>([])
  const [hiddenActions, setHiddenActions] = useState<SidebarAction[]>([])
  const actionsContainerRef = useRef<HTMLDivElement>(null)
  const [moreButtonRef, setMoreButtonRef] = useState<HTMLButtonElement | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const moreButtonWidth = 48 // Ширина кнопки "Еще"
  const buttonMargin = 16 // Отступ между кнопками

  // Функция для определения видимых и скрытых действий
  const updateVisibleActions = useCallback(() => {
    if (!actionsContainerRef.current) return

    const container = actionsContainerRef.current
    const containerWidth = container.clientWidth

    // Сначала проверим, умещаются ли все кнопки без кнопки "Еще"
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.visibility = 'hidden'
    tempDiv.style.display = 'flex'
    document.body.appendChild(tempDiv)

    let totalWidth = 0
    let allFit = true

    // Измеряем ширину всех кнопок
    actions.forEach((action) => {
      const tempButton = document.createElement('button')
      tempButton.innerText = action.label
      tempButton.className = 'px-4 py-2'
      tempDiv.appendChild(tempButton)

      totalWidth += tempButton.offsetWidth + buttonMargin
      tempDiv.removeChild(tempButton)

      // Если общая ширина превысила ширину контейнера, не все кнопки помещаются
      if (totalWidth > containerWidth) {
        allFit = false
      }
    })

    document.body.removeChild(tempDiv)

    // Если все кнопки помещаются, показываем их все
    if (allFit) {
      setVisibleActions(actions)
      setHiddenActions([])
      return
    }

    // Если не все помещаются, нужно выбрать, какие показывать
    // Резервируем место для кнопки "Еще"
    const reservedSpace = moreButtonWidth + buttonMargin
    const availableWidth = containerWidth - reservedSpace

    let currentWidth = 0
    const visible: SidebarAction[] = []
    const hidden: SidebarAction[] = []

    // Создаем новый временный контейнер для повторного измерения
    const tempDiv2 = document.createElement('div')
    tempDiv2.style.position = 'absolute'
    tempDiv2.style.visibility = 'hidden'
    tempDiv2.style.display = 'flex'
    document.body.appendChild(tempDiv2)

    actions.forEach((action) => {
      const tempButton = document.createElement('button')
      tempButton.innerText = action.label
      tempButton.className = 'px-4 py-2'
      tempDiv2.appendChild(tempButton)

      const buttonWidth = tempButton.offsetWidth + buttonMargin
      tempDiv2.removeChild(tempButton)

      // Если кнопка помещается, добавляем ее в видимые
      if (currentWidth + buttonWidth <= availableWidth) {
        currentWidth += buttonWidth
        visible.push(action)
      } else {
        // Иначе добавляем в скрытые
        hidden.push(action)
      }
    })

    document.body.removeChild(tempDiv2)

    // Гарантируем, что у нас всегда есть хотя бы одно видимое действие
    if (visible.length === 0 && hidden.length > 0) {
      const firstAction = hidden.shift()
      if (firstAction) {
        visible.push(firstAction)
      }
    }

    setVisibleActions(visible)
    setHiddenActions(hidden || [])
  }, [actions, buttonMargin, moreButtonWidth])

  // Обновляем список видимых действий при изменении размера
  useEffect(() => {
    updateVisibleActions()

    const handleResize = () => {
      updateVisibleActions()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [updateVisibleActions])

  // Инициализация при первом рендере
  useEffect(() => {
    updateVisibleActions()
  }, [updateVisibleActions])

  return (
    <div className="mt-4">
      <div
        ref={actionsContainerRef}
        className="flex items-center gap-4 flex-nowrap overflow-hidden"
      >
        {/* Видимые кнопки */}
        {visibleActions.map((action, index) => (
          <Button
            key={`visible-${index}`}
            variant={action.variant || 'secondary'}
            onClick={action.onClick}
            disabled={action.disabled}
            className="shrink-0"
          >
            {action.label}
          </Button>
        ))}

        {/* Кнопка "Еще", если есть скрытые действия */}
        {hiddenActions.length > 0 && (
          <Button
            ref={setMoreButtonRef}
            variant="secondary"
            onClick={() => setIsDropdownOpen(true)}
            data-testid="more-actions-button"
            className="shrink-0"
          >
            <MoreHoriz />
          </Button>
        )}
      </div>

      {/* Выпадающее меню со скрытыми действиями */}
      <DropdownMenu
        open={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        anchorEl={moreButtonRef}
        position="bottom-right"
        defaultItems={hiddenActions.map((action) => ({
          label: action.label,
          onClick: () => {
            action.onClick()
            setIsDropdownOpen(false)
          },
          disabled: action.disabled
        }))}
      />
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  title,
  description,
  badge,
  headerActions,
  footerActions,
  children,
  className,
  testId = 'sidebar'
}) => {
  // Состояние для анимации
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Обработка открытия/закрытия сайдбара
  useEffect(() => {
    if (open) {
      // При открытии сайдбара сначала делаем его видимым, потом анимируем
      setIsVisible(true)
      // Используем requestAnimationFrame, чтобы анимация началась после рендера
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      // При закрытии сначала запускаем анимацию закрытия
      setIsAnimating(false)
      // Затем после завершения анимации скрываем сайдбар полностью
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 0) // Должно совпадать с длительностью анимации

      return () => clearTimeout(timer)
    }
  }, [open])

  // Блокировка скролла body при открытии сайдбара
  useEffect(() => {
    if (open) {
      // Сохраняем текущую ширину скроллбара
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Блокируем прокрутку
      document.body.style.overflow = 'hidden'

      // Добавляем паддинг, равный ширине скроллбара
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      // Возвращаем все стили в исходное состояние
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      // Очистка при размонтировании компонента
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Функция плавного закрытия сайдбара
  const handleClose = useCallback(() => {
    setIsAnimating(false)
    // Задержка вызова onClose, чтобы анимация закрытия успела проиграться
    setTimeout(() => {
      onClose()
    }, 300) // Должно совпадать с длительностью анимации
  }, [onClose])

  // Обработчик клавиши Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleClose])

  // Если сайдбар не видим, не рендерим его совсем
  if (!isVisible && !open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" data-testid={testId}>
      {/* Затемненный фон */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          opacity: isAnimating ? 1 : 0
        }}
        data-testid={`${testId}-backdrop`}
      />

      {/* Контейнер сайдбара */}
      <div
        className={clsx(
          'relative flex flex-col h-full w-[600px] bg-mono-25 shadow-lg transition-transform duration-300 ease-out',
          className
        )}
        style={{
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)'
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid={`${testId}-container`}
      >
        {/* Хедер сайдбара */}
        <div className="p-[32px_24px] border-b border-mono-300" data-testid={`${testId}-header`}>
          {/* Первый контейнер: заголовок, описание и кнопка закрытия */}
          <div className="flex items-start justify-between">
            <div className="w-[508px]">
              <h2 className="text-h2 text-mono-900">{title}</h2>
              {description && <p className="mt-[2px] text-b3 text-mono-600">{description}</p>}
            </div>

            <button
              className="ml-2 text-mono-700 hover:text-mono-900 transition-colors"
              onClick={handleClose}
              aria-label="Закрыть"
              data-testid={`${testId}-close-button`}
            >
              <Close sx={{ width: 36, height: 36 }} />
            </button>
          </div>

          {/* Второй контейнер: сначала бейдж */}
          {badge && (
            <div className="mt-4">
              <Badge variant={badge.variant || 'default'}>{badge.text}</Badge>
            </div>
          )}

          {/* Третий контейнер: кнопки действий */}
          {headerActions && headerActions.length > 0 && (
            <HeaderActionsContainer actions={headerActions} />
          )}
        </div>

        {/* Тело сайдбара */}
        <div
          className="flex-1 overflow-y-auto p-6 bg-mono-25 overflow-x-hidden"
          data-testid={`${testId}-body`}
        >
          {children}
        </div>

        {/* Футер сайдбара */}
        {footerActions && footerActions.length > 0 && (
          <div className="p-8 border-t border-mono-300 bg-mono-25" data-testid={`${testId}-footer`}>
            <div className="flex items-center gap-4">
              {footerActions.map((action, index) => {
                // Создаем обертку для действий футера с возможностью закрытия сайдбара
                const handleAction = () => {
                  // Если это действие закрытия, используем анимированное закрытие
                  if (
                    action.label.toLowerCase().includes('закрыть') ||
                    action.label.toLowerCase().includes('отмен') ||
                    action.label.toLowerCase().includes('cancel') ||
                    action.label.toLowerCase().includes('close')
                  ) {
                    handleClose()
                  } else {
                    action.onClick()
                  }
                }

                return (
                  <Button
                    key={index}
                    variant={action.variant || 'primary'}
                    onClick={handleAction}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
