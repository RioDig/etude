import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { SvgIconProps } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'third'

type ButtonSize = 'large' | 'medium' | 'small'

interface ButtonBaseProps {
  /**
   * Вариант кнопки
   * @default 'primary'
   */
  variant?: ButtonVariant

  /**
   * Размер кнопки
   * @default 'medium'
   */
  size?: ButtonSize

  /**
   * Иконка слева от текста
   */
  leftIcon?: React.ReactElement<SvgIconProps>

  /**
   * Иконка справа от текста
   */
  rightIcon?: React.ReactElement<SvgIconProps>

  /**
   * Растягивать кнопку на всю ширину контейнера
   * @default false
   */
  fullWidth?: boolean

  /**
   * Содержимое кнопки
   */
  children?: React.ReactNode

  /**
   * Дополнительные CSS классы
   */
  className?: string
}

interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  /**
   * HTML-элемент, используемый для рендера
   * @default 'button'
   */
  as?: 'button'

  /**
   * Ссылка (используется только когда as='a')
   */
  href?: never

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to?: string
}

interface ButtonAsAnchorProps
  extends ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  /**
   * HTML-элемент, используемый для рендера
   */
  as: 'a'

  /**
   * Ссылка (используется только когда as='a')
   */
  href: string

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to?: never

  /**
   * Отключена ли ссылка
   */
  disabled?: boolean
}

interface ButtonAsLinkProps
  extends ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'href'> {
  /**
   * HTML-элемент, используемый для рендера
   */
  as: 'link'

  /**
   * Ссылка (используется только когда as='a')
   */
  href?: never

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to: string

  /**
   * Отключена ли ссылка
   */
  disabled?: boolean
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsLinkProps

/**
 * Универсальный компонент кнопки, который может быть отрендерен как кнопка или ссылка
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'medium',
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      as = 'button',
      ...restProps
    } = props

    const navigate = useNavigate()

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (restProps.onClick) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        restProps.onClick(e)
      }

      if (restProps.to && !e.defaultPrevented) {
        navigate(restProps.to)
      }
    }

    const isDisabled =
      as === 'button'
        ? !!restProps.disabled
        : as === 'a' || as === 'link'
          ? !!restProps.disabled
          : false

    const baseClasses = clsx(
      'inline-flex items-center justify-center font-medium transition duration-100 ease-out',
      isDisabled && 'pointer-events-none'
    )

    const typographyClasses = {
      large: 'text-b2',
      medium: 'text-b3',
      small: 'text-b4'
    }

    const getDisabledClasses = () => {
      if (!isDisabled) return ''

      switch (variant) {
        case 'primary':
          return 'bg-mono-200 border border-mono-200 text-mono-500'
        case 'secondary':
          return 'bg-white border border-mono-400 text-mono-400'
        case 'third':
          return 'bg-transparent border border-transparent text-mono-400'
        default:
          return ''
      }
    }

    const primaryClasses = clsx(
      !isDisabled && 'bg-blue-500 text-white border border-blue-500',
      !isDisabled && 'hover:bg-blue-600 hover:border-blue-600 hover:text-white',
      !isDisabled && 'active:bg-blue-700 active:border-blue-700 active:text-white',
      !isDisabled &&
        'focus:bg-blue-400 focus:border-purple-600 focus:text-white focus-visible:bg-blue-400 focus-visible:border-purple-600 focus-visible:text-white'
    )

    const secondaryClasses = clsx(
      !isDisabled && 'bg-white text-mono-800 border border-mono-800',
      !isDisabled && 'hover:border-mono-900 hover:text-mono-900',
      !isDisabled && 'active:border-mono-950 active:text-mono-950',
      !isDisabled &&
        'focus:border-purple-600 focus:text-mono-950 focus-visible:border-purple-600 focus-visible:text-mono-950'
    )

    const thirdClasses = clsx(
      !isDisabled && 'bg-white border border-transparent text-mono-900',
      !isDisabled && 'hover:bg-mono-200 hover:border-mono-200 hover:text-mono-900',
      !isDisabled && 'active:bg-mono-300 active:border-mono-300 active:text-mono-900',
      !isDisabled &&
        'focus:bg-white focus:border-purple-600 focus:text-mono-900 focus-visible:bg-white focus-visible:border-purple-600 focus-visible:text-mono-900'
    )

    const variantClasses = {
      primary: primaryClasses,
      secondary: secondaryClasses,
      third: thirdClasses
    }

    const sizeClasses = {
      large: 'h-[52px] px-4 py-3 rounded-[8px]',
      medium: 'h-[40px] px-4 py-2 rounded-[6px]',
      small: 'h-[36px] px-3 py-2 rounded-[4px]'
    }

    const linkClasses =
      as === 'a' || as === 'link'
        ? clsx(
            'inline-flex items-center justify-center font-medium transition duration-100 ease-out',
            !isDisabled
              ? 'text-blue-500 border border-transparent rounded-[4px]'
              : 'text-mono-500 border-transparent',
            !isDisabled && 'hover:text-blue-700 hover:underline',
            !isDisabled && 'active:text-blue-900 active:underline',
            !isDisabled &&
              'focus:text-blue-500 focus:border-purple-600 focus-visible:text-blue-500 focus-visible:border-purple-600'
          )
        : ''

    const getIconSize = () => {
      if (as === 'a' || as === 'link') return '20px'

      if (size === 'large') return '28px'
      else if (size === 'medium') return '24px'
      else return '20px'
    }

    const iconSize = getIconSize()
    const iconSx = { width: iconSize, height: iconSize, fontSize: iconSize }

    const leftIconElement = leftIcon
      ? React.cloneElement(leftIcon, {
          className: 'mr-[10px]',
          sx: iconSx
        })
      : null

    const rightIconElement = rightIcon
      ? React.cloneElement(rightIcon, {
          className: 'ml-[10px]',
          sx: iconSx
        })
      : null

    const buttonClassName = clsx(
      baseClasses,
      variantClasses[variant],
      getDisabledClasses(),
      sizeClasses[size],
      typographyClasses[size],
      fullWidth ? 'w-full' : '',
      className
    )

    const anchorClassName = clsx(
      linkClasses,
      isDisabled && 'text-mono-500',
      typographyClasses[size],
      fullWidth ? 'w-full' : '',
      className
    )

    if (as === 'a') {
      const { href, disabled, onClick, onDragStart, ...anchorProps } =
        restProps as ButtonAsAnchorProps

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }

      const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onDragStart?.(e)
      }

      const anchorHref = disabled ? undefined : href

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={anchorHref}
          className={anchorClassName}
          onClick={handleClick}
          onDragStart={handleDragStart}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          style={disabled ? { pointerEvents: 'none' } : undefined}
          role={'button'}
          {...anchorProps}
        >
          {leftIconElement}
          {children}
          {rightIconElement}
        </a>
      )
    }

    if (as === 'link') {
      const { to, disabled, onClick, onDragStart, ...linkProps } = restProps as ButtonAsLinkProps

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }

      const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onDragStart?.(e)
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={anchorClassName}
          onClick={handleClick}
          onDragStart={handleDragStart}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          style={disabled ? { pointerEvents: 'none' } : undefined}
          {...linkProps}
        >
          {leftIconElement}
          {children}
          {rightIconElement}
        </Link>
      )
    }

    if (as === 'button') {
      const { to, ...buttonProps } = restProps as ButtonAsButtonProps
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={buttonClassName}
          onClick={to ? handleButtonClick : buttonProps.onClick}
          {...buttonProps}
        >
          {leftIconElement}
          {children}
          {rightIconElement}
        </button>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonClassName}
        {...(restProps as ButtonAsButtonProps)}
      >
        {leftIconElement}
        {children}
        {rightIconElement}
      </button>
    )
  }
)

Button.displayName = 'Button'
