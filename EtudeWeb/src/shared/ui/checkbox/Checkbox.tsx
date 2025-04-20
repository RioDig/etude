import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Check } from '@mui/icons-material';
import { Hint } from '@/shared/ui/hint';
import { Info } from '@mui/icons-material';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
  testId?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  hint,
  className,
  disabled = false,
  checked,
  testId = 'checkbox',
  ...rest
}, ref) => {
  // Функция для определения стилей чекбокса
  const getCheckboxStyles = () => {
    // Базовые состояния
    if (disabled && checked) {
      return {
        box: 'border-mono-400 bg-mono-400',
        icon: 'text-white',
        label: 'text-mono-400',
        hint: 'text-mono-400'
      };
    }

    if (disabled) {
      return {
        box: 'border-mono-400 bg-transparent',
        icon: 'text-transparent',
        label: 'text-mono-400',
        hint: 'text-mono-400'
      };
    }

    if (checked) {
      return {
        box: 'border-mono-900 bg-mono-900 group-hover:bg-mono-950 group-hover:border-mono-950',
        icon: 'text-white',
        label: 'text-mono-900 group-hover:text-mono-950',
        hint: 'text-mono-900 group-hover:text-mono-950'
      };
    }

    // Дефолтное состояние
    return {
      box: 'border-mono-900 bg-transparent group-hover:border-mono-950',
      icon: 'text-transparent',
      label: 'text-mono-900 group-hover:text-mono-950',
      hint: 'text-mono-900 group-hover:text-mono-950',
    };
  };

  const styles = getCheckboxStyles();

  // Определяем единую длительность перехода для всех элементов
  const transitionClass = "transition-all duration-150 ease-in-out";

  return (
    <label
      className={clsx(
        'inline-flex items-center gap-2 cursor-pointer group',
        disabled && 'cursor-not-allowed',
        className
      )}
      data-testid={testId}
    >
      <div className="relative flex-shrink-0">
        <input
          ref={ref}
          type="checkbox"
          className="absolute opacity-0 w-5 h-5 cursor-pointer peer"
          disabled={disabled}
          checked={checked}
          {...rest}
        />
        <div
          className={clsx(
            'w-[20px] h-[20px] rounded-[4px] border',
            'flex items-center justify-center',
            transitionClass,
            styles.box
          )}
        >
          <Check
            className={clsx(
              transitionClass,
              styles.icon
            )}
            sx={{ fontSize: 16 }}
          />
        </div>
      </div>

      <div className="inline-flex items-baseline gap-1">
        {label && (
          <span
            className={clsx(
              'text-b4-regular select-none',
              transitionClass,
              styles.label
            )}
          >
            {label}
          </span>
        )}

        {hint && (
          <Hint content={hint}>
            <Info
              sx={{
                width: 16,
                height: 16,
                fontSize: 16,
                verticalAlign: 'text-bottom'
              }}
              className={clsx(
                'cursor-help',
                transitionClass,
                styles.hint
              )}
            />
          </Hint>
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;