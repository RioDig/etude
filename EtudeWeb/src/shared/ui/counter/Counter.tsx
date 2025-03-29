import React from 'react';
import clsx from 'clsx';

export interface CounterProps {
  /**
   * Значение для отображения
   * @default 0
   */
  value: number;

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
 * Компонент Counter - показывает числовое значение
 */
export const Counter: React.FC<CounterProps> = ({
  value,
  className,
  testId = 'counter',
}) => {
  return (
    <div
      className={clsx(
        'h-[28px] px-2 py-1 rounded-md',
        'bg-mono-200 text-mono-800',
        'text-b3 font-medium inline-flex items-center justify-center',
        className
      )}
      data-testid={testId}
    >
      {value}
    </div>
  );
};

export default Counter;