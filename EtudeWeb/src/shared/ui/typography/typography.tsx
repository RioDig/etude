/**
 * Утилита для работы с типографикой
 * Предоставляет объект с классами Tailwind для каждого стиля текста из дизайн-системы
 */

// eslint-disable-next-line react-refresh/only-export-components
export const typography = {
  // Headings
  h1: 'text-h1',
  h2: 'text-h2',
  h2Regular: 'text-h2-regular',

  // Body
  b1: 'text-b1',
  b2: 'text-b2',
  b2Regular: 'text-b2-regular',
  b3Semibold: 'text-b3-semibold',
  b3: 'text-b3',
  b3Regular: 'text-b3-regular',
  b4Semibold: 'text-b4-semibold',
  b4: 'text-b4',
  b4Regular: 'text-b4-regular',
  b4Light: 'text-b4-light',
  b5: 'text-b5',
};

/**
 * Компоненты типографики для использования в React
 */
export type TypographyVariant = keyof typeof typography;

interface TypographyProps {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Использование:
 *
 * import { Typography } from '@/shared/ui/typography';
 *
 * <Typography variant="h1">Заголовок</Typography>
 * <Typography variant="b3" as="span">Текст</Typography>
 */
export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`${typography[variant]} ${className}`}>
      {children}
    </Component>
  );
};

/**
 * Пример использования классов напрямую:
 *
 * import { typography } from '@/shared/ui/typography';
 *
 * <div className={typography.b4Regular}>Текст в стиле Body 4 Regular</div>
 */