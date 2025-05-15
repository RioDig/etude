export type CalendarViewMode = 'month' | 'week' | 'half-year'

export type CardStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface CalendarCardTag {
  id: string
  label: string
}

export type TrainingFormat = 'offline' | 'online' | 'mixed'

export type TrainingCategory = 'hard-skills' | 'soft-skills' | 'management'

export type TrainingType = 'course' | 'conference' | 'webinar' | 'training'

export interface CalendarCard {
  id: string
  title: string
  status: CardStatus
  startDate: Date
  endDate: Date
  description: string
  employee: string
  format: TrainingFormat
  category: TrainingCategory
  type: TrainingType
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
