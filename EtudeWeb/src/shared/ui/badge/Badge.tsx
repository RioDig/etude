import React from 'react';
import clsx from 'clsx';
import { SvgIconProps } from '@mui/material';

export type BadgeVariant = 'default' | 'error' | 'warning' | 'success' | 'system';

export interface BadgeProps {
  /**
   * Содержимое бейджа
   */
  children: React.ReactNode;

  /**
   * Вариант бейджа
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * MUI иконка слева от текста
   */
  leftIcon?: React.ReactElement<SvgIconProps>;

  /**
   * MUI иконка справа от текста
   */
  rightIcon?: React.ReactElement<SvgIconProps>;

  /**
   * Дополнительные CSS классы
   */
  className?: string;

  /**
   * ID для тестирования
   */
  testId?: string;
}

/**
 * Компонент Badge - используется для отображения статусов, меток и коротких информационных сообщений.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  leftIcon,
  rightIcon,
  className,
  testId = 'badge',
}) => {
  // Базовые стили для всех вариантов
  const baseStyles = 'inline-flex items-center justify-center h-[26px] px-2 rounded-[4px] text-b4-regular';

  // Стили в зависимости от варианта
  const variantStyles = {
    default: 'bg-mono-200 text-mono-950',
    error: 'bg-red-500 text-mono-25',
    warning: 'bg-yellow-600 text-mono-25',
    success: 'bg-green-600 text-mono-25',
    system: 'bg-blue-500 text-mono-25',
  };

  // Определение размера для MUI иконок
  const iconSx = { width: 18, height: 18, fontSize: 18 };

  // Клонирование иконок с нужными стилями
  const leftIconElement = leftIcon
    ? React.cloneElement(leftIcon, {
      sx: { ...iconSx, ...(leftIcon.props.sx || {}) },
      className: clsx('mr-1', leftIcon.props.className)
    })
    : null;

  const rightIconElement = rightIcon
    ? React.cloneElement(rightIcon, {
      sx: { ...iconSx, ...(rightIcon.props.sx || {}) },
      className: clsx('ml-1', rightIcon.props.className)
    })
    : null;

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        className
      )}
      data-testid={testId}
    >
      {leftIconElement}
      <span>{children}</span>
      {rightIconElement}
    </div>
  );
};

export default Badge;