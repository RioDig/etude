import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import { SvgIconProps } from '@mui/material'

export type MenuItemVariant = 'default' | 'warning'

export interface MenuItemProps {
  /**
   * Текст пункта меню
   */
  label: string

  /**
   * Вариант стиля пункта
   * @default 'default'
   */
  variant?: MenuItemVariant

  /**
   * MUI иконка слева от текста
   */
  icon?: React.ReactElement<SvgIconProps>

  /**
   * Отключение пункта меню
   * @default false
   */
  disabled?: boolean

  /**
   * Обработчик клика по пункту
   */
  onClick?: () => void

  /**
   * ID для тестирования
   */
  testId?: string
}

export interface DropdownMenuProps {
  /**
   * Флаг открытия меню
   */
  open: boolean

  /**
   * Обработчик закрытия меню
   */
  onClose: () => void

  /**
   * Элемент, относительно которого позиционируется меню
   */
  anchorEl?: HTMLElement | null

  /**
   * Позиция меню относительно элемента
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  /**
   * Элементы меню стандартного стиля
   */
  defaultItems?: MenuItemProps[]

  /**
   * Элементы меню с предупреждающим стилем
   */
  warningItems?: MenuItemProps[]

  /**
   * Максимальное количество отображаемых записей
   * @default 7
   */
  maxItems?: number

  /**
   * Расстояние между меню и элементом-якорем (в пикселях)
   * @default 8
   */
  offset?: number

  /**
   * Ширина меню (в пикселях)
   * @default 300
   */
  width?: number

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
 * Компонент DropdownMenu - выпадающее меню с действиями
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open,
  onClose,
  anchorEl,
  position = 'bottom-right',
  defaultItems = [],
  warningItems = [],
  maxItems = 7,
  offset = 8,
  width = 300,
  className,
  testId = 'dropdown-menu'
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const [isPositioned, setIsPositioned] = useState(false)

  const handleItemClick = (onClick?: () => void) => () => {
    if (onClick) onClick()
    onClose()
  }

  useEffect(() => {
    if (anchorEl && open) {
      setIsPositioned(false)

      requestAnimationFrame(() => {
        const anchorRect = anchorEl.getBoundingClientRect()
        const { top, left, bottom, right } = anchorRect

        let newTop = 0
        let newLeft = 0

        if (position.startsWith('bottom')) {
          newTop = bottom + offset
        } else if (position.startsWith('top')) {
          newTop = top - offset
          if (menuRef.current) {
            newTop -= menuRef.current.offsetHeight
          }
        }

        if (position.endsWith('right')) {
          newLeft = right - width
        } else if (position.endsWith('left')) {
          newLeft = left
        }

        setMenuPosition({ top: newTop, left: newLeft })

        requestAnimationFrame(() => {
          setIsPositioned(true)
        })
      })
    } else {
      setIsPositioned(false)
    }
  }, [anchorEl, open, position, offset, width])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(anchorEl === event.target || anchorEl?.contains(event.target as Node))
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onClose, anchorEl])

  const limitedDefaultItems = defaultItems.slice(0, maxItems)
  const remainingItems = Math.max(0, maxItems - limitedDefaultItems.length)
  const limitedWarningItems = warningItems.slice(0, remainingItems)

  if (!open) return null

  return (
    <div
      ref={menuRef}
      className={clsx(
        'fixed z-50 overflow-hidden bg-mono-25',
        'w-[300px] rounded-lg shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]',
        'py-2 transition-opacity duration-150',
        isPositioned ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        width: `${width}px`
      }}
      data-testid={testId}
    >
      {limitedDefaultItems.length > 0 && (
        <div className="">
          {limitedDefaultItems.map((item, index) => (
            <MenuItem
              key={`default-${index}`}
              {...item}
              variant="default"
              onClick={handleItemClick(item.onClick)}
              testId={item.testId || `${testId}-default-item-${index}`}
            />
          ))}
        </div>
      )}

      {limitedDefaultItems.length > 0 && limitedWarningItems.length > 0 && (
        <div className="mx-0 my-2 h-[1px] bg-mono-300"></div>
      )}

      {limitedWarningItems.length > 0 && (
        <div className="">
          {limitedWarningItems.map((item, index) => (
            <MenuItem
              key={`warning-${index}`}
              {...item}
              variant="warning"
              onClick={handleItemClick(item.onClick)}
              testId={item.testId || `${testId}-warning-item-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Компонент MenuItem - пункт выпадающего меню
 */
const MenuItem: React.FC<MenuItemProps> = ({
  label,
  variant = 'default',
  icon,
  disabled = false,
  onClick,
  testId = 'menu-item'
}) => {
  const variantStyles = disabled
    ? 'text-mono-500'
    : variant === 'warning'
      ? 'text-red-500'
      : 'text-mono-950'

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  const iconElement = icon
    ? React.cloneElement(icon, {
        sx: { width: 20, height: 20, fontSize: 20 },
        className: clsx('mr-3', icon.props.className) // mr-3 = 12px в Tailwind
      })
    : null

  return (
    <div
      className={clsx(
        'flex items-center px-4 py-[8px] h-[36px]',
        'text-b4-regular cursor-pointer',
        'transition-colors duration-150',
        variantStyles,
        !disabled && 'hover:bg-mono-100 active:bg-mono-200',
        disabled && 'cursor-not-allowed'
      )}
      onClick={handleClick}
      data-testid={testId}
    >
      {iconElement}
      {label}
    </div>
  )
}

export default DropdownMenu
