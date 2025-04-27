// src/widgets/calendar/ui/CalendarHeader.tsx
import React from 'react'
import { createPortal } from 'react-dom'
import { CalendarTodayOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Switch } from '@/shared/ui/switch'
import { DatePicker } from '@/shared/ui/datepicker/Datepicker'
import { CalendarViewMode } from '../model/types'

interface CalendarHeaderProps {
  title: string
  viewMode: CalendarViewMode
  isDatePickerOpen: boolean
  datePickerAnchor: HTMLElement | null
  currentDate: Date
  onPrevPeriod: () => void
  onNextPeriod: () => void
  onOpenDatePicker: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDateSelect: (date: Date) => void
  onViewModeChange: (mode: string) => void
  setIsDatePickerOpen: (isOpen: boolean) => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  viewMode,
  isDatePickerOpen,
  datePickerAnchor,
  currentDate,
  onPrevPeriod,
  onNextPeriod,
  onOpenDatePicker,
  onDateSelect,
  onViewModeChange,
  setIsDatePickerOpen
}) => {
  return (
    <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-md shadow-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPeriod}
          className="p-2 hover:bg-mono-100 rounded-full transition-colors"
          aria-label="Предыдущий период"
        >
          <ChevronLeft />
        </button>

        <button
          className="flex items-center gap-1 px-3 py-1 hover:bg-mono-100 rounded-md transition-colors"
          onClick={onOpenDatePicker}
          aria-label="Выбрать дату"
        >
          <span className="text-b3-semibold">{title}</span>
          <CalendarTodayOutlined fontSize="small" />
        </button>

        <button
          onClick={onNextPeriod}
          className="p-2 hover:bg-mono-100 rounded-full transition-colors"
          aria-label="Следующий период"
        >
          <ChevronRight />
        </button>

        {isDatePickerOpen &&
          datePickerAnchor &&
          createPortal(
            <div
              className="fixed z-50"
              style={{
                top: `${datePickerAnchor.getBoundingClientRect().bottom + 8}px`,
                left: `${datePickerAnchor.getBoundingClientRect().left}px`
              }}
            >
              <DatePicker
                value={currentDate}
                onChange={onDateSelect}
                onClose={() => setIsDatePickerOpen(false)}
              />
            </div>,
            document.body
          )}
      </div>

      <Switch
        options={[
          { id: 'week', label: 'Неделя' },
          { id: 'month', label: 'Месяц' }
        ]}
        value={viewMode}
        onChange={onViewModeChange}
        size="small"
      />
    </div>
  )
}

export default CalendarHeader
