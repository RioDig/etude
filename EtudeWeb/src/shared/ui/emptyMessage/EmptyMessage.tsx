import React from 'react';
import clsx from 'clsx';
import { typography } from "@/shared/ui/typography";


type EmptyMessageVariant = 'large' | 'small';

export interface EmptyMessageProps {
  /**
   * Вариант отображения (large или small)
   * @default 'large'
   */
  variant?: EmptyMessageVariant;

  /**
   * URL изображения
   */
  imageUrl: string;

  /**
   * Заголовок
   */
  title: string;

  /**
   * Подзаголовок/описание
   */
  description: string;

  /**
   * Кнопка действия (опционально)
   */
  actionButton?: React.ReactNode;

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
 * Компонент EmptyMessage - используется для отображения пустого состояния с изображением,
 * заголовком, описанием и опциональной кнопкой действия.
 * Имеет две вариации: большую (large) и маленькую (small).
 */
export const EmptyMessage: React.FC<EmptyMessageProps> = ({
  variant = 'large',
  imageUrl,
  title,
  description,
  actionButton,
  className,
  testId = 'empty-message',
}) => {
  // Конфигурация для разных вариантов
  const variantConfig = {
    large: {
      imageSize: 'w-[180px] h-[180px]',
      imageToTitle: 'mt-8', // 32px
      titleClass: typography.h1,
      titleToDescription: 'mt-4', // 16px
      titleColor: 'text-gray-900',
      descriptionClass: typography.h2Regular,
      descriptionToButton: 'mt-10', // 40px
      descriptionColor: 'text-mono-700',
    },
    small: {
      imageSize: 'w-[120px] h-[120px]',
      imageToTitle: 'mt-6', // 24px
      titleClass: typography.h2,
      titleToDescription: 'mt-2', // 8px
      titleColor: 'text-gray-900',
      descriptionClass: typography.b2Regular,
      descriptionToButton: 'mt-8', // 32px
      descriptionColor: 'text-mono-700',
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={clsx(
        'flex flex-col items-center text-center',
        className
      )}
      data-testid={testId}
    >
      {/* Изображение */}
      <div className={clsx(config.imageSize, 'flex items-center justify-center')}>
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Заголовок */}
      <h2 className={clsx(config.titleClass, config.titleColor, config.imageToTitle)}>
        {title}
      </h2>

      {/* Описание */}
      <p className={clsx(config.descriptionClass, config.descriptionColor, config.titleToDescription)}>
        {description}
      </p>

      {/* Кнопка (если есть) */}
      {actionButton && (
        <div className={config.descriptionToButton}>
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyMessage;