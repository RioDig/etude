import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  CleaningServices
} from '@mui/icons-material'
import { Dropdown } from '@/shared/ui/dropdown'
import { DatePicker } from '@/shared/ui/datepicker'
import { usePageFilters } from '@/entities/filter'
import { FilterOption, FilterProps } from './types'

const MAX_DISPLAY_LENGTH = 15

/**
 * Компонент Filter - группа кнопок для фильтрации данных
 * Сохраняет состояние фильтров в Zustand по pageId
 */
export const Filter: React.FC<FilterProps> = ({
  filters,
  pageId,
  onChange,
  onReset,
  className,
  testId = 'filter'
}) => {
  const { filters: storeFilters, setFilter, resetFilters } = usePageFilters(pageId)

  const [openFilterId, setOpenFilterId] = useState<string | null>(null)

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilterId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFilterClick = (filterId: string) => {
    setOpenFilterId((prev) => (prev === filterId ? null : filterId))
  }

  const handleDropdownSelect = (filterId: string, value: string) => {
    setFilter(filterId, value)
    if (onChange) onChange(filterId, value)
    setOpenFilterId(null)
  }

  const handleDateSelect = (filterId: string, date: Date) => {
    setFilter(filterId, date)
    if (onChange) onChange(filterId, date)
    setOpenFilterId(null)
  }

  const handleReset = () => {
    resetFilters()
    if (onReset) onReset()
  }

  const handleClose = () => {
    setOpenFilterId(null)
  }

  const truncateText = (text: string, maxLength: number = MAX_DISPLAY_LENGTH): string => {
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  }

  const getDisplayValue = (filter: FilterOption): string => {
    const storeValue = storeFilters[filter.id]

    if (storeValue === undefined || storeValue === null || storeValue === '') {
      return truncateText(filter.defaultValue || 'Все')
    }

    if (storeValue instanceof Date) {
      return truncateText(new Intl.DateTimeFormat('ru-RU').format(storeValue))
    }

    if (filter.type === 'dropdown' && filter.options) {
      const option = filter.options.find((opt) => opt.value === storeValue)
      return truncateText(option ? option.label : String(storeValue))
    }

    return truncateText(String(storeValue))
  }

  const isFilterActive = (filterId: string): boolean => {
    return (
      storeFilters[filterId] !== undefined &&
      storeFilters[filterId] !== null &&
      storeFilters[filterId] !== ''
    )
  }

  return (
    <div ref={filterRef} className={clsx('flex flex-wrap gap-2', className)} data-testid={testId}>
      {filters.map((filter) => {
        const isActive = isFilterActive(filter.id)
        const isOpen = openFilterId === filter.id

        return (
          <div key={filter.id} className="relative">
            <button
              type="button"
              onClick={() => handleFilterClick(filter.id)}
              className={clsx(
                'flex items-center px-3 py-1.5 rounded-[4px]',
                'transition-colors duration-150',
                isOpen ? 'bg-mono-300' : 'bg-mono-200 hover:bg-mono-300'
              )}
              data-testid={`${testId}-button-${filter.id}`}
              title={getDisplayValue(filter)}
            >
              <span
                className={clsx(
                  'text-b4',
                  isActive ? 'text-mono-700 font-normal' : 'text-mono-900 font-medium'
                )}
              >
                {truncateText(filter.label, 12)}
              </span>

              <span
                className={clsx(
                  'ml-3',
                  'text-b4',
                  isActive ? 'text-mono-900 font-medium' : 'text-mono-700 font-light'
                )}
              >
                {getDisplayValue(filter)}
              </span>

              <span className="ml-1 text-mono-900">
                {isOpen ? (
                  <KeyboardArrowUpOutlined fontSize="small" />
                ) : (
                  <KeyboardArrowDownOutlined fontSize="small" />
                )}
              </span>
            </button>

            {isOpen && (
              <div className="absolute z-30 mt-1 min-w-[240px]">
                {filter.type === 'dropdown' && filter.options && (
                  <Dropdown
                    options={filter.options}
                    value={storeFilters[filter.id] as string}
                    onSelect={(value) => handleDropdownSelect(filter.id, value)}
                    onClose={handleClose}
                    maxHeight={300}
                    className="w-full"
                  />
                )}

                {filter.type === 'date' && (
                  <div className="w-[280px]">
                    <DatePicker
                      value={storeFilters[filter.id] as Date}
                      onChange={(date) => handleDateSelect(filter.id, date)}
                      onClose={handleClose}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={handleReset}
        className={clsx(
          'flex items-center px-2 py-1.5 rounded-[4px]',
          'text-mono-900 hover:text-mono-600',
          'text-b4 font-medium',
          'transition-colors duration-150'
        )}
        data-testid={`${testId}-reset-button`}
      >
        <CleaningServices fontSize="small" />
        <span className="ml-2">Сбросить</span>
      </button>
    </div>
  )
}
