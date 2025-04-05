import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Close } from '@mui/icons-material';
import { Button } from '@/shared/ui/button';

export interface ModalProps {
  /**
   * Открыто ли модальное окно
   */
  isOpen: boolean;

  /**
   * Обработчик закрытия
   */
  onClose: () => void;

  /**
   * Заголовок модального окна
   */
  title: string;

  /**
   * Содержимое модального окна
   */
  children: React.ReactNode;

  /**
   * Элементы для размещения в подвале (справа)
   */
  actions?: React.ReactNode;

  /**
   * Ссылка для подвала (слева)
   */
  linkAction?: {
    label: string;
    to: string;
    onClick?: () => void;
  };

  /**
   * Дополнительные CSS классы
   */
  className?: string;

  /**
   * ID для тестирования
   */
  testId?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  linkAction,
  className,
  testId = 'modal',
}) => {
  // Блокируем прокрутку body при открытии модального окна
  // и предотвращаем смещение контента при исчезновении скроллбара
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую ширину скроллбара
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Блокируем прокрутку
      document.body.style.overflow = 'hidden';

      // Добавляем паддинг, равный ширине скроллбара
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Возвращаем все стили в исходное состояние
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      // Очистка при размонтировании компонента
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Отключаем обработчик клавиши Escape, так как модалка должна закрываться
  // только по крестику или кнопкам в футере

  // Если модальное окно закрыто, не рендерим его
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid={testId}
    >
      {/* Затемненный фон */}
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        data-testid={`${testId}-backdrop`}
      />

      {/* Контейнер модального окна */}
      <div
        className={clsx(
          'relative bg-white rounded-2xl shadow-lg',
          'max-w-[720px] w-full mx-4',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        data-testid={`${testId}-container`}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between px-8 pt-7 pb-0">
          <h2 className="text-h2 text-mono-950">{title}</h2>
          <button
            className="w-9 h-9 flex items-center justify-center ml-4 text-mono-700 hover:text-mono-950 transition-colors"
            onClick={onClose}
            aria-label="Закрыть"
            data-testid={`${testId}-close-button`}
          >
            <Close sx={{height: '36px', width: '36px'}} />
          </button>
        </div>

        {/* Основное содержимое */}
        <div className="p-8" data-testid={`${testId}-body`}>
          {children}
        </div>

        {/* Подвал с действиями */}
        {(linkAction || actions) && (
          <div className="px-8 pb-7" data-testid={`${testId}-footer`}>
            <div className="flex items-center justify-between pt-7 border-t border-mono-500">
              <div>
                {linkAction && (
                  <Button
                    as="link"
                    to={linkAction.to}
                    onClick={linkAction.onClick}
                    variant="third"
                  >
                    {linkAction.label}
                  </Button>
                )}
              </div>

              <div className="flex gap-4">
                {actions}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;