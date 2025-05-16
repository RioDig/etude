import React, { useState, useRef, useEffect, forwardRef } from 'react'
import clsx from 'clsx'
import { Control } from '@/shared/ui/controls'
import { KeyboardArrowDownOutlined, ClearOutlined } from '@mui/icons-material'
import { Dropdown } from '@/shared/ui/dropdown'
import { Spinner } from '@/shared/ui/spinner'
import { employeeAutocompleteApi, Employee } from '@/shared/api/employeeAutocomplete'
import useDebounce from '@/shared/hooks/useDebounce'

export interface AutocompleteSelectProps {
  label?: React.ReactNode
  placeholder?: string
  hint?: React.ReactNode
  error?: string
  required?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string, employeeData?: Employee) => void
  excludeIds?: string[]
  className?: string
  testId?: string
  initialEmployee?: Employee
}

export const AutocompleteSelect = forwardRef<HTMLDivElement, AutocompleteSelectProps>(
  (
    {
      label,
      placeholder = 'Начните вводить для поиска...',
      hint,
      error,
      required = false,
      disabled = false,
      value,
      onChange,
      excludeIds = [],
      className,
      testId = 'autocomplete-select',
      initialEmployee
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState<{ value: string; label: string; data: Employee }[]>([])
    const [hasMoreItems, setHasMoreItems] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    useEffect(() => {
      if (initialEmployee && value && !searchTerm) {
        setSearchTerm(
          initialEmployee.name + (initialEmployee.position ? `, ${initialEmployee.position}` : '')
        )
        setSelectedEmployee(initialEmployee)
      }
    }, [initialEmployee, value])

    useEffect(() => {
      const fetchEmployees = async () => {
        if (!debouncedSearchTerm && !isOpen) return

        setIsLoading(true)
        try {
          const { employees, hasMoreItems } = await employeeAutocompleteApi.getEmployees(
            debouncedSearchTerm,
            excludeIds
          )

          const newOptions = employees.map((emp) => ({
            value: emp.id,
            label: emp.name + (emp.position ? `, ${emp.position}` : ''),
            data: emp
          }))

          setOptions(newOptions)
          setHasMoreItems(hasMoreItems)
        } catch (error) {
          console.error('Failed to fetch employees:', error)
          console.error(selectedEmployee)
          setOptions([])
          setHasMoreItems(false)
        } finally {
          setIsLoading(false)
        }
      }

      fetchEmployees()
    }, [debouncedSearchTerm, excludeIds, isOpen])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)

      if (e.target.value === '') {
        setSelectedEmployee(null)
        onChange?.('', undefined)
      }

      if (!isOpen) {
        setIsOpen(true)
      }
    }

    const handleSelect = (optionValue: string) => {
      const selectedOption = options.find((opt) => opt.value === optionValue)

      if (selectedOption) {
        setSearchTerm(selectedOption.label)
        setSelectedEmployee(selectedOption.data)
        onChange?.(optionValue, selectedOption.data)
      }

      setIsOpen(false)
      inputRef.current?.blur()
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSearchTerm('')
      setSelectedEmployee(null)
      onChange?.('', undefined)
      inputRef.current?.focus()
    }

    const handleToggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen)

        if (!isOpen && !searchTerm) {
          /* empty */
        }
      }
    }

    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleToggleDropdown()
    }

    const dropdownOptions = [...options]

    if (hasMoreItems) {
      dropdownOptions.push({
        value: '__more_items__',
        label: 'Слишком много вариантов, уточните запрос',
        data: {} as Employee,
        disabled: true
      } as never)
    }

    return (
      <Control.Root className={className} testId={testId} ref={ref}>
        <Control.Label label={label} required={required} hint={hint} htmlFor="autocomplete-input" />

        <div className="relative" ref={containerRef}>
          <div
            className={clsx(
              'flex items-center border rounded-md transition-colors duration-150',
              disabled
                ? 'border-mono-400 bg-mono-200 text-mono-500 cursor-not-allowed'
                : error
                  ? 'border-red-500'
                  : 'border-mono-400 focus-within:border-mono-500 cursor-text'
            )}
            onClick={() => {
              if (!disabled) {
                inputRef.current?.focus()
                if (!isOpen) {
                  setIsOpen(true)
                }
              }
            }}
          >
            <input
              ref={inputRef}
              id="autocomplete-input"
              type="text"
              className={clsx(
                'w-full px-3 py-2 h-[40px]',
                'text-b3-regular',
                'bg-transparent border-none outline-none',
                'placeholder:text-mono-400',
                disabled && 'cursor-not-allowed placeholder:text-mono-500',
                disabled ? 'text-mono-500' : 'text-mono-950'
              )}
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              disabled={disabled}
              onFocus={() => setIsOpen(true)}
            />

            <div className="flex items-center pr-3 gap-1">
              {isLoading ? (
                <Spinner size="small" className="mr-2" />
              ) : searchTerm ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center justify-center text-mono-700 hover:text-mono-900 focus:outline-none"
                  aria-label="Очистить поле"
                >
                  <ClearOutlined fontSize="small" />
                </button>
              ) : null}

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
          </div>

          {isOpen && (
            <div className="absolute z-20 mt-1 w-full">
              <Dropdown
                options={dropdownOptions}
                value={value}
                onSelect={handleSelect}
                onClose={() => setIsOpen(false)}
                maxHeight={300}
                closeOnSelect={true}
              />
            </div>
          )}
        </div>

        <Control.Error error={error} />
      </Control.Root>
    )
  }
)

AutocompleteSelect.displayName = 'AutocompleteSelect'
