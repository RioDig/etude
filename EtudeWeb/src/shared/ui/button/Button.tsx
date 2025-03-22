import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { SvgIconProps } from '@mui/material';

// Типы вариантов кнопки
type ButtonVariant = 'primary' | 'secondary' | 'third';

// Размеры кнопки
type ButtonSize = 'large' | 'medium' | 'small';

// Базовые пропсы для компонента Button
interface ButtonBaseProps {
  /**
   * Вариант кнопки
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Размер кнопки
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Иконка слева от текста
   */
  leftIcon?: React.ReactElement<SvgIconProps>;

  /**
   * Иконка справа от текста
   */
  rightIcon?: React.ReactElement<SvgIconProps>;

  /**
   * Растягивать кнопку на всю ширину контейнера
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Содержимое кнопки
   */
  children?: React.ReactNode;

  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

// Пропсы для кнопки как элемента button
interface ButtonAsButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  /**
   * HTML-элемент, используемый для рендера
   * @default 'button'
   */
  as?: 'button';

  /**
   * Ссылка (используется только когда as='a')
   */
  href?: never;

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to?: never;
}

// Пропсы для кнопки как HTML-ссылки
interface ButtonAsAnchorProps extends ButtonBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  /**
   * HTML-элемент, используемый для рендера
   */
  as: 'a';

  /**
   * Ссылка (используется только когда as='a')
   */
  href: string;

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to?: never;
}

// Пропсы для кнопки как компонента Link из react-router-dom
interface ButtonAsLinkProps extends ButtonBaseProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'href'> {
  /**
   * HTML-элемент, используемый для рендера
   */
  as: 'link';

  /**
   * Ссылка (используется только когда as='a')
   */
  href?: never;

  /**
   * URL для react-router-dom Link (используется только когда as='link')
   */
  to: string;
}

// Объединение всех типов пропсов
type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsLinkProps;

/**
 * Универсальный компонент кнопки, который может быть отрендерен как кнопка или ссылка
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
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
  } = props;

  // Базовые классы для всех вариантов кнопок
  const baseClasses = 'inline-flex items-center justify-center font-medium transition duration-100 ease-out';

  // Классы для разных вариантов кнопок
  const variantClasses = {
    primary: 'bg-blue-500 text-white border-1 border-blue-500 ' +
      'hover:bg-blue-600 hover:border-blue-600 ' +
      'active:bg-blue-700 active:border-blue-700 ' +
      'focus:bg-blue-400 focus:border-purple-600 ' +
      'focus-visible:bg-blue-400 focus-visible:border-purple-600 ' +
      'disabled:bg-mono-200 disabled:border-mono-200 disabled:text-mono-500',
    secondary: 'bg-white text-mono-800 border-[1px] border-mono-800 ' +
      'hover:border-mono-900 hover:text-mono-900 ' +
      'active:border-mono-950 active:text-mono-950 ' +
      'focus:border-purple-600 focus:text-mono-950 ' +
      'focus-visible:border-purple-600 focus-visible:text-mono-950 ' +
      'disabled:border-mono-400 disabled:text-mono-400',
    third: 'bg-white border-[1px] border-white ' +
      'hover:bg-mono-200 hover:border-mono-200 hover:text-mono-900 ' +
      'active:bg-mono-300 active:border-mono-300 active:text-mono-900 ' +
      'focus:bg-white focus:border-purple-600 focus:text-mono-900 ' +
      'focus-visible:bg-white focus-visible:border-purple-600 focus-visible:text-mono-900 ' +
      'disabled:bg-white disabled:border-white disabled:text-mono-400',
  };

  // Классы для разных размеров кнопок
  const sizeClasses = {
    large: 'h-[52px] px-[16px] py-[12px] text-xl rounded-[8px]',
    medium: 'h-[40px] px-[16px] py-[8px] text-base rounded-[6px]',
    small: 'h-[36px] px-[12px] py-[8px] text-sm rounded-[4px]',
  };

  // Получение правильного размера для MUI иконок в пикселях
  const getIconSize = () => {
    if (size === 'large') return '28px';
    else if (size === 'medium') return '24px';
    else return '20px';
  };

  // Модификация иконок с учетом размера кнопки
  const iconSize = getIconSize();
  const iconSx = { width: iconSize, height: iconSize, fontSize: iconSize };

  const leftIconElement = leftIcon
    ? React.cloneElement(leftIcon, {
      className: 'mr-[10px]',
      sx: iconSx
    })
    : null;

  const rightIconElement = rightIcon
    ? React.cloneElement(rightIcon, {
      className: 'ml-[10px]',
      sx: iconSx
    })
    : null;

  // Общие классы для кнопки
  const buttonClassName = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  );

  // Рендер компонента в зависимости от типа (button, a, link)
  if (as === 'a') {
    const { href, ...anchorProps } = restProps as ButtonAsAnchorProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={buttonClassName}
        {...anchorProps}
      >
        {leftIconElement}
        {children}
        {rightIconElement}
      </a>
    );
  }

  if (as === 'link') {
    const { to, ...linkProps } = restProps as ButtonAsLinkProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={buttonClassName}
        {...linkProps}
      >
        {leftIconElement}
        {children}
        {rightIconElement}
      </Link>
    );
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
  );
});

Button.displayName = 'Button';