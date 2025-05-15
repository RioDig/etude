import React from 'react'
import clsx from 'clsx'
import { SvgIconProps } from '@mui/material'

export type SwitchOption = {
  /**
   * Уникальный идентификатор опции
   */
  id: string

  /**
   * Текст для отображения
   */
  label?: string

  /**
   * Иконка от Material UI
   */
  icon?: React.ReactElement<SvgIconProps>

  /**
   * Флаг отключения опции
   * @default false
   */
  disabled?: boolean
}

export interface SwitchProps {
  /**
   * Список опций переключателя
   */
  options: SwitchOption[]

  /**
   * Идентификатор выбранной опции
   */
  value: string

  /**
   * Обработчик изменения выбранной опции
   */
  onChange: (value: string) => void

  /**
   * Размер переключателя
   * @default 'medium'
   */
  size?: 'medium' | 'small'

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
 * Компонент Switch - переключатель режимов отображения
 */
export const Switch: React.FC<SwitchProps> = ({
  options,
  value,
  onChange,
  size = 'medium',
  className,
  testId = 'switch'
}) => {
  const containerStyles = clsx(
    'inline-flex items-stretch rounded-[4px] border border-mono-200 overflow-hidden max-w-full',
    className
  )

  const optionSizeStyles = {
    medium: 'h-[40px] py-2 px-3 text-b3-regular',
    small: 'h-[28px] py-1 px-2 text-b4-regular'
  }

  const iconSize = size === 'medium' ? 24 : 20

  const handleOptionClick = (option: SwitchOption) => {
    if (!option.disabled && option.id !== value) {
      onChange(option.id)
    }
  }

  return (
    <div className={containerStyles} data-testid={testId}>
      {options.map((option) => {
        const isSelected = option.id === value

        const optionStyles = clsx(
          'flex items-center justify-center transition-colors duration-150',
          'min-w-0 flex-shrink-1 flex-grow-1 overflow-hidden',
          optionSizeStyles[size],
          'text-mono-800',

          isSelected ? 'bg-mono-200' : 'bg-mono-25',
          !option.disabled && !isSelected && 'hover:bg-mono-100 active:bg-mono-200',
          option.disabled && 'opacity-50 cursor-not-allowed'
        )

        return (
          <div
            key={option.id}
            className={optionStyles}
            onClick={() => handleOptionClick(option)}
            data-testid={`${testId}-option-${option.id}`}
            role="button"
            aria-pressed={isSelected}
            aria-disabled={option.disabled}
          >
            {option.icon &&
              React.cloneElement(option.icon, {
                sx: { width: iconSize, height: iconSize, fontSize: iconSize },
                className: clsx(
                  option.label && 'mr-2',
                  'flex-shrink-0',
                  option.icon.props.className
                )
              })}

            {option.label && <span className="truncate">{option.label}</span>}
          </div>
        )
      })}
    </div>
  )
}

export default Switch
