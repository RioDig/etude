import React from 'react';
import clsx from 'clsx';

type TagSize = 'small' | 'medium';

export interface TagProps {
  /**
   * Содержимое тега
   */
  children: React.ReactNode;

  /**
   * Размер тега
   * @default 'medium'
   */
  size?: TagSize;

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
 * Компонент Tag - используется для отображения меток, категорий и других коротких информационных элементов.
 * Также используется как label в компоненте Hint.
 */
export const Tag: React.FC<TagProps> = ({
  children,
  size = 'medium',
  className,
  testId = 'tag',
}) => {
  const sizeClasses = {
    medium: 'h-[26px] py-1 px-2 text-b4-regular',
    small: 'h-[22px] py-0.5 px-2 text-b5',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center',
        'rounded-[4px] border border-mono-950/20 bg-mono-950/5',
        sizeClasses[size],
        className
      )}
      data-testid={testId}
    >
      <span className="font-normal">
        {children}
      </span>
    </div>
  );
};

export default Tag;