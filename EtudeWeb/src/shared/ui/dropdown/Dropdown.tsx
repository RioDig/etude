import React, { useRef } from 'react'
import clsx from 'clsx'
import { Check } from '@mui/icons-material'

export interface DropdownOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface DropdownProps {
  /**
   * Список опций для выпадающего списка
   */
  options: DropdownOption[]

  /**
   * Выбранное значение в режиме одиночного выбора
   */
  value?: string

  /**
   * Выбранные значения в режиме множественного выбора
   */
  selectedValues?: string[]

  /**
   * Режим множественного выбора
   * @default false
   */
  multiSelect?: boolean

  /**
   * Обработчик выбора значения в режиме одиночного выбора
   */
  onSelect?: (value: string) => void

  /**
   * Обработчик выбора значения в режиме множественного выбора
   */
  onMultiSelect?: (values: string[]) => void

  /**
   * Обработчик закрытия выпадающего списка
   */
  onClose?: () => void

  /**
   * Максимальная высота списка в пикселях
   * @default 300
   */
  maxHeight?: number

  /**
   * Показать скролл
   * @default true
   */
  showScroll?: boolean

  /**
   * Закрыть при выборе в режиме одиночного выбора
   * @default true
   */
  closeOnSelect?: boolean

  /**
   * Отключить клик по пустому пространству для закрытия
   * @default false
   */
  disableClickOutside?: boolean

  /**
   * Дополнительные классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент выпадающего списка (Dropdown)
 */
export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  selectedValues = [],
  multiSelect = false,
  onSelect,
  onMultiSelect,
  onClose,
  maxHeight = 300,
  showScroll = true,
  closeOnSelect = true,
  // disableClickOutside = false,
  className,
  testId = 'dropdown'
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSingleSelect = (option: DropdownOption) => {
    if (option.disabled) return

    if (onSelect) {
      onSelect(option.value)
    }

    if (closeOnSelect) {
      if (onClose) onClose()
    }
  }

  const handleMultiSelect = (option: DropdownOption) => {
    if (option.disabled) return

    const isSelected = selectedValues.includes(option.value)
    const newValues = isSelected
      ? selectedValues.filter((val) => val !== option.value)
      : [...selectedValues, option.value]

    if (onMultiSelect) {
      onMultiSelect(newValues)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx('bg-white rounded-md shadow-lg', 'w-full border border-mono-300', className)}
      style={{ zIndex: 50 }}
      data-testid={testId}
    >
      <ul
        className={clsx('py-1', showScroll && 'overflow-y-auto')}
        style={{ maxHeight: `${maxHeight}px` }}
        role={multiSelect ? 'listbox' : 'menu'}
        aria-multiselectable={multiSelect}
      >
        {options.map((option) => {
          const isSelected = multiSelect
            ? selectedValues.includes(option.value)
            : option.value === value

          const handleClick = () => {
            if (multiSelect) {
              handleMultiSelect(option)
            } else {
              handleSingleSelect(option)
            }
          }

          return (
            <li
              key={option.value}
              role={multiSelect ? 'option' : 'menuitem'}
              aria-selected={isSelected || undefined}
              className={clsx(
                'px-4 py-2',
                'max-h-[52px] min-h-[34px] flex items-center justify-between',
                'focus-visible:outline-none',
                'transition-colors duration-150 ease-in-out',
                'bg-white',
                'hover:bg-mono-100',
                'active:bg-mono-200',
                isSelected && 'bg-mono-200',
                'focus:bg-mono-100 focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-blue-500',
                option.disabled && 'cursor-not-allowed pointer-events-none',
                !option.disabled && 'cursor-pointer'
              )}
              onClick={handleClick}
              tabIndex={option.disabled ? -1 : 0}
            >
              <div className="flex flex-col text-left">
                <span
                  className={clsx(
                    'text-b4-regular',
                    option.disabled ? 'text-mono-500' : 'text-mono-950'
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    className={clsx(
                      'text-b4-regular mt-1',
                      option.disabled ? 'text-mono-500' : 'text-mono-600'
                    )}
                  >
                    {option.description}
                  </span>
                )}
              </div>
              {isSelected && <Check className="text-mono-950" sx={{ width: 20, height: 20 }} />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Dropdown
