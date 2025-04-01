import { ReactNode } from 'react';

// Типы для компонента
export type NotificationVariant = 'success' | 'error' | 'info' | 'base';

export interface NotificationProps {
  /**
   * Вариант уведомления
   * @default 'base'
   */
  variant?: NotificationVariant;

  /**
   * Заголовок уведомления
   */
  title: string;

  /**
   * Описание уведомления (опционально)
   */
  description?: string;

  /**
   * Кнопка действия (опционально)
   */
  action?: ReactNode;

  /**
   * Обработчик закрытия уведомления
   */
  onClose: () => void;

  /**
   * Автоматически закрыть уведомление через указанное время (мс)
   * Если null - не закрывать автоматически
   * @default определяется наличием action: без action - 3000мс, с action - 7000мс
   */
  autoClose?: number | null;

  /**
   * Показывать индикатор времени
   * @default true
   */
  showTimer?: boolean;

  /**
   * Дополнительные CSS классы
   */
  className?: string;

  /**
   * ID для тестирования
   */
  testId?: string;

  /**
   * Флаг для анимации исчезновения
   */
  isLeaving?: boolean;

  /**
   * ID уведомления
   */
  id?: string;

  /**
   * Время начала таймера
   */
  startTime?: number;

  /**
   * Время окончания таймера
   */
  endTime?: number;
}