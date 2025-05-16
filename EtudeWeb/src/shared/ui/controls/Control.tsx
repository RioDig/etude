import React, { useState, useRef, useEffect, forwardRef } from 'react'
import clsx from 'clsx'
import {
  ClearOutlined,
  Info,
  KeyboardArrowDownOutlined,
  CalendarTodayOutlined
} from '@mui/icons-material'
import { SvgIconProps } from '@mui/material'
import { Hint } from '@/shared/ui/hint'

import { DatePicker } from '@/shared/ui/datepicker/Datepicker.tsx'

import { Dropdown, DropdownOption } from '@/shared/ui/dropdown/Dropdown.tsx'

export type ControlVariant = 'default' | 'filled' | 'error' | 'disabled'
export type ControlSize = 'default' | 'large'

interface ControlBaseProps {
  /**
   * Метка контрола
   */
  label?: React.ReactNode

  /**
   * Плейсхолдер контрола
   */
  placeholder?: string

  /**
   * Текст подсказки, который появляется при наведении на иконку
   */
  hint?: React.ReactNode

  /**
   * Сообщение об ошибке, отображаемое под контролом
   */
  error?: string

  /**
   * Является ли поле обязательным
   * @default false
   */
  required?: boolean

  /**
   * Отключен ли контрол
   * @default false
   */
  disabled?: boolean

  /**
   * Вариант контрола (визуальный стиль)
   * @default 'default'
   */
  variant?: ControlVariant

  /**
   * Размер контрола
   * @default 'default'
   */
  size?: ControlSize

  /**
   * Дополнительный класс
   */
  className?: string

  /**
   * Обработчик нажатия на кнопку очистки
   */
  onClear?: () => void

  /**
   * ID для тестирования
   */
  testId?: string
}

const ControlRoot = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string
    testId?: string
  }>
>(({ children, className, testId = 'control' }, ref) => {
  return (
    <div ref={ref} className={clsx('flex flex-col w-full', className)} data-testid={testId}>
      {children}
    </div>
  )
})
ControlRoot.displayName = 'Control.Root'

const RequiredIndicator = React.memo(() => (
  <div className="w-[6px] h-[6px] rounded-full bg-red-500 ml-1 mt-1" aria-hidden="true" />
))

const ControlLabel: React.FC<{
  label?: React.ReactNode
  required?: boolean
  filled?: boolean
  hint?: React.ReactNode
  htmlFor?: string
  className?: string
  testId?: string
}> = ({
  label,
  required = false,
  filled = false,
  hint,
  htmlFor,
  className,
  testId = 'control-label'
}) => {
  if (!label) return null

  return (
    <div className={clsx('flex items-center mb-3', className)} data-testid={testId}>
      <div className="flex items-start">
        <label htmlFor={htmlFor} className="text-b3-regular text-mono-950">
          {label}
        </label>
        {required && !filled && <RequiredIndicator />}
      </div>

      {hint && (
        <div className="ml-1">
          <Hint content={hint}>
            <Info
              sx={{ width: 16, height: 16, fontSize: 16 }}
              className="text-mono-700 cursor-help"
            />
          </Hint>
        </div>
      )}
    </div>
  )
}

const ControlError: React.FC<{
  error?: string
  className?: string
  testId?: string
}> = ({ error, className, testId = 'control-error' }) => {
  if (!error) return null

  return (
    <div
      className={clsx('text-red-500 text-b4-regular mt-1 text-left', className)}
      data-testid={testId}
    >
      {error}
    </div>
  )
}

const ControlWrapper: React.FC<{
  children: React.ReactNode
  variant?: ControlVariant
  disabled?: boolean
  error?: string
  onClick?: React.MouseEventHandler
  className?: string
  testId?: string
}> = ({
  children,
  variant = 'default',
  disabled = false,
  error,
  onClick,
  className,
  testId = 'control-wrapper'
}) => {
  const variantStyles = {
    default: 'border-mono-400 focus-within:border-mono-500',
    filled: 'border-mono-400 bg-mono-50 focus-within:border-mono-500',
    error: 'border-red-500',
    disabled: 'border-mono-400 bg-mono-200 text-mono-500'
  }

  let actualVariant = variant
  if (disabled) actualVariant = 'disabled'
  else if (error) actualVariant = 'error'

  return (
    <div
      className={clsx(
        'flex items-center border rounded-md',
        'transition-colors duration-150',
        variantStyles[actualVariant],
        disabled ? 'cursor-not-allowed' : 'cursor-text',
        className
      )}
      onClick={disabled ? undefined : onClick}
      data-testid={testId}
    >
      {children}
    </div>
  )
}

const ClearButton: React.FC<{
  onClear: () => void
  disabled?: boolean
  visible?: boolean
  className?: string
  testId?: string
}> = ({
  onClear,
  disabled = false,
  visible = true,
  className,
  testId = 'control-clear-button'
}) => {
  if (disabled || !visible) return null

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClear()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'flex items-center justify-center',
        'text-mono-700 hover:text-mono-900',
        'focus:outline-none',
        className
      )}
      aria-label="Очистить поле"
      data-testid={testId}
    >
      <ClearOutlined fontSize="small" />
    </button>
  )
}

interface InputControlProps
  extends ControlBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  type?: string
  leftIcon?: React.ReactElement<SvgIconProps>
  rightIcon?: React.ReactElement<SvgIconProps>
}

export const InputControl = forwardRef<HTMLInputElement, InputControlProps>(
  (
    {
      label,
      placeholder = '',
      hint,
      error,
      required = false,
      disabled = false,
      variant = 'default',
      size = 'default',
      className,
      value = '',
      onChange,
      onClear,
      leftIcon,
      rightIcon,
      type = 'text',
      testId = 'input-control',
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
    const [localValue, setLocalValue] = useState(value)

    const isFilled = !!localValue

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
      onChange?.(e)
    }

    const handleClear = () => {
      setLocalValue('')
      onClear?.()

      const syntheticEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(syntheticEvent)
    }

    const heightClass = size === 'default' ? 'h-[40px]' : 'h-[72px]'

    const iconSx = { width: 18, height: 18, fontSize: 18 }

    const leftIconElement = leftIcon
      ? React.cloneElement(leftIcon, {
          sx: { ...iconSx, ...(leftIcon.props.sx || {}) },
          className: clsx('ml-3 text-mono-700', leftIcon.props.className)
        })
      : null

    const rightIconElement = rightIcon
      ? React.cloneElement(rightIcon, {
          sx: { ...iconSx, ...(rightIcon.props.sx || {}) },
          className: clsx('mr-3 text-mono-700', rightIcon.props.className)
        })
      : null

    return (
      <ControlRoot className={className} testId={testId}>
        <ControlLabel
          label={label}
          required={required}
          filled={isFilled}
          hint={hint}
          htmlFor={inputId}
        />

        <ControlWrapper variant={variant} disabled={disabled} error={error}>
          {leftIconElement}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(
              'w-full px-3 py-2',
              heightClass,
              'text-b3-regular',
              disabled ? 'text-mono-500' : 'text-mono-950',
              'bg-transparent border-none outline-none',
              'placeholder:text-mono-400',
              leftIconElement && 'pl-1',
              disabled && 'cursor-not-allowed placeholder:text-mono-500'
            )}
            placeholder={placeholder}
            value={localValue}
            onChange={handleChange}
            disabled={disabled}
            {...rest}
          />

          <div className="flex items-center pr-3 gap-1">
            <ClearButton onClear={handleClear} disabled={disabled} visible={!!localValue} />
            {rightIconElement}
          </div>
        </ControlWrapper>

        <ControlError error={error} />
      </ControlRoot>
    )
  }
)
InputControl.displayName = 'Control.Input'

interface InputNumberControlProps extends Omit<InputControlProps, 'type'> {
  min?: number
  max?: number
  step?: number
}

export const InputNumberControl = forwardRef<HTMLInputElement, InputNumberControlProps>(
  ({ min, max, step = 1, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.valueAsNumber

      if (!isNaN(newValue)) {
        if (max !== undefined && newValue > max) {
          newValue = max
          e.target.value = max.toString()
        }

        if (min !== undefined && newValue < min) {
          e.target.value = min.toString()
        }
      }

      onChange?.(e)
    }

    return (
      <InputControl
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        value={value?.toString()}
        {...props}
      />
    )
  }
)
InputNumberControl.displayName = 'Control.InputNumber'

interface TextareaControlProps
  extends ControlBaseProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  rows?: number
  autoResize?: boolean
}

export const TextareaControl = forwardRef<HTMLTextAreaElement, TextareaControlProps>(
  (
    {
      label,
      placeholder = '',
      hint,
      error,
      required = false,
      disabled = false,
      variant = 'default',
      className,
      value = '',
      onChange,
      onClear,
      rows = 3,
      autoResize = true,
      testId = 'textarea-control',
      id,
      ...rest
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`
    const [localValue, setLocalValue] = useState(value)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const isFilled = !!localValue

    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current)
      } else if (ref) {
        ref.current = textareaRef.current
      }
    }, [ref])

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalValue(e.target.value)
      onChange?.(e)

      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }

    const handleClear = () => {
      setLocalValue('')
      onClear?.()

      const syntheticEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLTextAreaElement>
      onChange?.(syntheticEvent)

      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [autoResize])

    return (
      <ControlRoot className={className} testId={testId}>
        <ControlLabel
          label={label}
          required={required}
          filled={isFilled}
          hint={hint}
          htmlFor={textareaId}
        />

        <ControlWrapper variant={variant} disabled={disabled} error={error}>
          <div className="flex w-full relative">
            <textarea
              ref={textareaRef}
              id={textareaId}
              className={clsx(
                'w-full px-3 py-2',
                'min-h-[72px] resize-none',
                'text-b3-regular',
                disabled ? 'text-mono-500' : 'text-mono-950',
                'bg-transparent border-none outline-none',
                'placeholder:text-mono-400',
                'pr-8', // Отступ справа для кнопки очистки
                disabled && 'cursor-not-allowed placeholder:text-mono-500'
              )}
              placeholder={placeholder}
              value={localValue}
              onChange={handleChange}
              disabled={disabled}
              rows={rows}
              {...rest}
            />

            <div className="absolute top-2 right-3 z-10">
              <ClearButton onClear={handleClear} disabled={disabled} visible={!!localValue} />
            </div>
          </div>
        </ControlWrapper>

        <ControlError error={error} />
      </ControlRoot>
    )
  }
)
TextareaControl.displayName = 'Control.Textarea'

export type SelectOption = DropdownOption

interface SelectControlProps extends ControlBaseProps {
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  onOpen?: () => void
  onClose?: () => void
}

export const SelectControl = forwardRef<HTMLDivElement, SelectControlProps>(
  (
    {
      label,
      placeholder = '',
      hint,
      error,
      required = false,
      disabled = false,
      variant = 'default',
      size = 'default',
      className,
      value,
      onChange,
      onClear,
      options,
      onOpen,
      onClose,
      testId = 'select-control',
      ...rest
    },
    ref
  ) => {
    const selectId = `select-${Math.random().toString(36).substring(2, 9)}`
    const [isOpen, setIsOpen] = useState(false)
    const controlRef = useRef<HTMLDivElement>(null)

    const isFilled = !!value

    const selectedOption = options.find((option) => option.value === value)

    const handleToggle = () => {
      if (!disabled) {
        const newIsOpen = !isOpen
        setIsOpen(newIsOpen)

        if (newIsOpen) {
          onOpen?.()
        } else {
          onClose?.()
        }
      }
    }

    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleToggle()
    }

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
      onClose?.()
    }

    const handleClear = () => {
      onChange?.('')
      if (onClear) onClear()
    }

    const handleCloseDropdown = () => {
      setIsOpen(false)
      onClose?.()
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const heightClass = size === 'default' ? 'h-[40px]' : 'h-[72px]'

    return (
      <ControlRoot ref={ref} className={className} testId={testId}>
        <ControlLabel
          label={label}
          required={required}
          filled={isFilled}
          hint={hint}
          htmlFor={selectId}
        />

        <div className="relative" ref={controlRef}>
          <ControlWrapper
            variant={variant}
            disabled={disabled}
            error={error}
            onClick={handleToggle}
          >
            <div
              id={selectId}
              className={clsx(
                'w-full px-3 py-2',
                heightClass,
                'flex items-center',
                'text-b3-regular',
                selectedOption ? 'text-mono-950' : 'text-mono-400',
                disabled && 'cursor-not-allowed text-mono-500'
              )}
              tabIndex={disabled ? -1 : 0}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              {...rest}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </div>

            <div className="flex items-center pr-3 gap-1">
              {selectedOption && (
                <ClearButton onClear={handleClear} disabled={disabled} visible={!!selectedOption} />
              )}
              <div
                className="cursor-pointer hover:bg-mono-100 p-1 rounded transition-colors"
                onClick={handleArrowClick}
              >
                <KeyboardArrowDownOutlined
                  fontSize="small"
                  className={clsx(
                    'text-mono-700 transition-transform',
                    isOpen && 'transform rotate-180'
                  )}
                />
              </div>
            </div>
          </ControlWrapper>

          {isOpen && (
            <div className="absolute z-20 mt-1 w-full">
              <Dropdown
                options={options}
                value={value}
                onSelect={handleSelect}
                onClose={handleCloseDropdown}
                maxHeight={300}
                closeOnSelect={true}
              />
            </div>
          )}
        </div>

        <ControlError error={error} />
      </ControlRoot>
    )
  }
)
SelectControl.displayName = 'Control.Select'

interface MultiSelectControlProps extends Omit<Omit<SelectControlProps, 'onChange'>, 'value'> {
  value?: string[]
  onChange?: (value: string[]) => void
}

export const MultiSelectControl = forwardRef<HTMLDivElement, MultiSelectControlProps>(
  (
    {
      label,
      placeholder = '',
      hint,
      error,
      required = false,
      disabled = false,
      variant = 'default',
      size = 'default',
      className,
      value = [],
      onChange,
      onClear,
      options,
      onOpen,
      onClose,
      testId = 'multiselect-control',
      ...rest
    },
    ref
  ) => {
    const selectId = `multiselect-${Math.random().toString(36).substring(2, 9)}`
    const [isOpen, setIsOpen] = useState(false)
    const controlRef = useRef<HTMLDivElement>(null)

    const isFilled = value.length > 0

    const selectedOptions = options.filter((option) => value.includes(option.value))

    const handleToggle = () => {
      if (!disabled) {
        const newIsOpen = !isOpen
        setIsOpen(newIsOpen)
        if (newIsOpen) {
          onOpen?.()
        } else {
          onClose?.()
        }
      }
    }

    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleToggle()
    }

    const handleMultiSelect = (values: string[]) => {
      onChange?.(values)
    }

    const handleClear = () => {
      onChange?.([])
      if (onClear) onClear()
    }

    const handleRemoveTag = (optionValue: string) => (e: React.MouseEvent) => {
      e.stopPropagation()
      const newValue = value.filter((v) => v !== optionValue)
      onChange?.(newValue)
    }

    const handleCloseDropdown = () => {
      setIsOpen(false)
      onClose?.()
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const minHeightClass = size === 'default' ? 'min-h-[40px]' : 'min-h-[72px]'

    return (
      <ControlRoot ref={ref} className={className} testId={testId}>
        <ControlLabel
          label={label}
          required={required}
          filled={isFilled}
          hint={hint}
          htmlFor={selectId}
        />

        <div className="relative" ref={controlRef}>
          <ControlWrapper
            variant={variant}
            disabled={disabled}
            error={error}
            onClick={handleToggle}
          >
            <div
              id={selectId}
              className={clsx(
                'w-full px-3 py-2',
                minHeightClass,
                'flex flex-wrap items-center gap-1',
                'text-b3-regular',
                selectedOptions.length === 0 && 'text-mono-400',
                disabled && 'cursor-not-allowed text-mono-500'
              )}
              tabIndex={disabled ? -1 : 0}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              {...rest}
            >
              {selectedOptions.length > 0
                ? selectedOptions.map((option) => (
                    <div
                      key={option.value}
                      className="inline-flex items-center border border-mono-950/20 bg-mono-200 text-b4-regular rounded-[4px] px-2 py-0.5"
                    >
                      <span>{option.label}</span>
                      <button
                        type="button"
                        className="ml-1 text-mono-700 hover:text-mono-900"
                        onClick={handleRemoveTag(option.value)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                : placeholder}
            </div>

            <div className="flex items-center shrink-0 pr-3 gap-1">
              {selectedOptions.length > 0 && (
                <ClearButton
                  onClear={handleClear}
                  disabled={disabled}
                  visible={selectedOptions.length > 0}
                />
              )}
              <div
                className="cursor-pointer hover:bg-mono-100 p-1 rounded transition-colors"
                onClick={handleArrowClick}
              >
                <KeyboardArrowDownOutlined
                  fontSize="small"
                  className={clsx(
                    'text-mono-700 transition-transform',
                    isOpen && 'transform rotate-180'
                  )}
                />
              </div>
            </div>
          </ControlWrapper>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full">
              <Dropdown
                options={options}
                selectedValues={value}
                multiSelect={true}
                onMultiSelect={handleMultiSelect}
                onClose={handleCloseDropdown}
                maxHeight={300}
                closeOnSelect={false}
              />
            </div>
          )}
        </div>

        <ControlError error={error} />
      </ControlRoot>
    )
  }
)
MultiSelectControl.displayName = 'Control.MultiSelect'

interface DateInputControlProps extends Omit<InputControlProps, 'onChange' | 'value' | 'type'> {
  value?: Date | null
  onChange?: (date: Date | null) => void
  format?: string
  minDate?: Date
  maxDate?: Date
}

export const DateInputControl = forwardRef<HTMLInputElement, DateInputControlProps>(
  ({
    label,
    placeholder = '',
    hint,
    error,
    required = false,
    disabled = false,
    variant = 'default',
    size = 'default',
    className,
    value = null,
    onChange,
    onClear,
    format = 'dd.MM.yyyy',
    minDate,
    maxDate,
    testId = 'date-input-control',
    ...rest
  }) => {
    const inputId = `date-input-${Math.random().toString(36).substring(2, 9)}`
    const [isOpen, setIsOpen] = useState(false)
    const [displayValue, setDisplayValue] = useState('')
    const controlRef = useRef<HTMLDivElement>(null)

    const isFilled = !!value

    useEffect(() => {
      if (value) {
        setDisplayValue(new Intl.DateTimeFormat('ru-RU').format(value))
      } else {
        setDisplayValue('')
      }
    }, [value, format])

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    const handleCalendarClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleToggle()
    }

    const handleClear = () => {
      if (onChange) onChange(null)
      if (onClear) onClear()
    }

    const handleDateSelect = (date: Date) => {
      if (onChange) onChange(date)
      setIsOpen(false)
    }

    const handleCloseDatePicker = () => {
      setIsOpen(false)
    }

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    const heightClass = size === 'default' ? 'h-[40px]' : 'h-[72px]'

    return (
      <ControlRoot className={className} testId={testId}>
        <ControlLabel
          label={label}
          required={required}
          filled={isFilled}
          hint={hint}
          htmlFor={inputId}
        />

        <div className="relative" ref={controlRef}>
          <ControlWrapper
            variant={variant}
            disabled={disabled}
            error={error}
            onClick={handleToggle}
          >
            <div
              id={inputId}
              className={clsx(
                'w-full px-3 py-2',
                heightClass,
                'flex items-center',
                'text-b3-regular',
                displayValue ? 'text-mono-950' : 'text-mono-400',
                disabled && 'cursor-not-allowed text-mono-500'
              )}
              tabIndex={disabled ? -1 : 0}
              role="textbox"
              aria-readonly="true"
              {...rest}
            >
              {displayValue || placeholder}
            </div>

            <div className="flex items-center pr-3 gap-1">
              {displayValue && (
                <ClearButton onClear={handleClear} disabled={disabled} visible={!!displayValue} />
              )}
              <div
                className="cursor-pointer hover:bg-mono-100 p-1 rounded transition-colors"
                onClick={handleCalendarClick}
              >
                <CalendarTodayOutlined fontSize="small" className="text-mono-700" />
              </div>
            </div>
          </ControlWrapper>

          {isOpen && (
            <div className="absolute z-20 mt-1 right-0">
              <DatePicker
                value={value || undefined}
                onChange={handleDateSelect}
                minDate={minDate}
                maxDate={maxDate}
                onClose={handleCloseDatePicker}
              />
            </div>
          )}
        </div>

        <ControlError error={error} />
      </ControlRoot>
    )
  }
)
DateInputControl.displayName = 'Control.DateInput'

// eslint-disable-next-line react-refresh/only-export-components
export const Control = {
  Input: InputControl,
  InputNumber: InputNumberControl,
  Textarea: TextareaControl,
  Select: SelectControl,
  MultiSelect: MultiSelectControl,
  DateInput: DateInputControl,
  Root: ControlRoot,
  Label: ControlLabel,
  Error: ControlError
}
