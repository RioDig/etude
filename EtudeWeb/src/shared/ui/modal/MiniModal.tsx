import React, { useEffect } from 'react'
import clsx from 'clsx'
import { SvgIconProps } from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'

export interface MiniModalProps {
  /**
   * Открыто ли модальное окно
   */
  isOpen: boolean

  /**
   * Обработчик закрытия
   */
  onClose: () => void

  /**
   * Иконка для отображения (по умолчанию DeleteOutline)
   */
  icon?: React.ReactElement<SvgIconProps>

  /**
   * Заголовок минимодального окна
   */
  title: string

  /**
   * Описание
   */
  description?: string

  /**
   * Кнопки для отображения (максимум 2)
   */
  buttons: React.ReactNode[]

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

export const MiniModal: React.FC<MiniModalProps> = ({
  isOpen,
  // onClose,
  icon = <DeleteOutline />,
  title,
  description,
  buttons = [],
  className,
  testId = 'mini-modal'
}) => {
  if (buttons.length > 2) {
    console.warn(
      'MiniModal: максимальное количество кнопок - 2. Лишние кнопки будут проигнорированы.'
    )
    buttons = buttons.slice(0, 2)
  }

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      document.body.style.overflow = 'hidden'

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid={testId}>
      <div className="absolute inset-0 bg-black bg-opacity-25" data-testid={`${testId}-backdrop`} />

      <div
        className={clsx('relative bg-white rounded-2xl shadow-lg', 'w-[420px] p-8', className)}
        onClick={(e) => e.stopPropagation()}
        data-testid={`${testId}-container`}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-3">
            {React.cloneElement(icon, {
              sx: { width: 64, height: 64 },
              className: clsx('text-mono-700', icon.props.className)
            })}
          </div>

          <h2 className="text-h2 text-mono-950 text-center mb-3">{title}</h2>

          {description && (
            <p className="text-b3-regular text-mono-950 text-center">{description}</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {buttons.map((button, index) => (
            <div key={index} className="w-full">
              {button}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MiniModal
