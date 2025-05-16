import { CourseFormat, CourseTrack, CourseType, StatusType } from '@/shared/types'

export type CalendarViewMode = 'month' | 'week'

export interface CalendarCard {
  id: string
  title: string
  status: StatusType | undefined
  startDate: Date
  endDate: Date
  description: string
  employee?: string
  format: CourseFormat
  track: CourseTrack
  type: CourseType
  trainingCenter?: string
}

export interface CalendarProps {
  cards: CalendarCard[]
  initialViewMode?: CalendarViewMode
  initialDate?: Date
  className?: string
  onCardClick?: (card: CalendarCard) => void
  onDateChange?: (date: Date) => void
  onViewModeChange?: (mode: CalendarViewMode) => void
  pageId?: string
}
