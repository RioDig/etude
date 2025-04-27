// src/shared/ui/spinner/Spinner.tsx
import React from 'react'
import clsx from 'clsx'

export type SpinnerSize = 'small' | 'medium' | 'large'
export type SpinnerVariant = 'primary' | 'secondary' | 'white'

export interface SpinnerProps {
  /**
   * Размер спиннера
   * @default 'medium'
   */
  size?: SpinnerSize

  /**
   * Вариант цветовой схемы
   * @default 'primary'
   */
  variant?: SpinnerVariant

  /**
   * Текст, отображаемый рядом со спиннером
   */
  label?: string

  /**
   * Показывать ли спиннер над полупрозрачным фоном на всю область родителя
   * @default false
   */
  overlay?: boolean

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
 * Компонент Spinner - индикатор загрузки
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  label,
  overlay = false,
  className,
  testId = 'spinner'
}) => {
  // Определение размеров для разных вариантов
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3'
  }

  // Определение цветов для разных вариантов
  const variantClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-mono-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  }

  // Классы для лейбла
  const labelClasses = {
    small: 'text-b5 ml-2',
    medium: 'text-b4-regular ml-3',
    large: 'text-b3-regular ml-4'
  }

  // Если используется как оверлей
  if (overlay) {
    return (
      <div
        className={clsx(
          'absolute inset-0 flex items-center justify-center',
          'bg-mono-950/5 backdrop-blur-[1px] z-50',
          className
        )}
        data-testid={testId}
      >
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              'animate-spin rounded-full',
              sizeClasses[size],
              variantClasses[variant]
            )}
            data-testid={`${testId}-circle`}
          />
          {label && (
            <span
              className={clsx(
                'mt-3 text-mono-800',
                size === 'small' ? 'text-b4-regular' : 'text-b3-regular'
              )}
              data-testid={`${testId}-label`}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Стандартный вариант
  return (
    <div className={clsx('flex items-center', className)} data-testid={testId}>
      <div
        className={clsx('animate-spin rounded-full', sizeClasses[size], variantClasses[variant])}
        data-testid={`${testId}-circle`}
      />
      {label && (
        <span className={clsx('text-mono-800', labelClasses[size])} data-testid={`${testId}-label`}>
          {label}
        </span>
      )}
    </div>
  )
}
