import { CardStatus } from '../model/types'

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const generateCalendarDays = (startDate: Date, days: number): Date[] => {
  const result = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < days; i++) {
    result.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

export const getFormatLabel = (format: string) => {
  switch (format) {
    case 'offline':
      return 'Очный'
    case 'online':
      return 'Дистанционный'
    case 'mixed':
      return 'Смешанный'
    default:
      return format
  }
}

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'hard-skills':
      return 'Hard Skills'
    case 'soft-skills':
      return 'Soft Skills'
    case 'management':
      return 'Management'
    default:
      return category
  }
}

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'course':
      return 'Курс'
    case 'conference':
      return 'Конференция'
    case 'webinar':
      return 'Вебинар'
    case 'training':
      return 'Тренинг'
    default:
      return type
  }
}

export const getStatusColor = (status: CardStatus): string => {
  switch (status) {
    case 'pending':
      return 'border-yellow-300 bg-yellow-100 hover:bg-yellow-200'
    case 'approved':
      return 'border-green-300 bg-green-100 hover:bg-green-200'
    case 'rejected':
      return 'border-red-300 bg-red-100 hover:bg-red-200'
    case 'completed':
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
    default:
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
  }
}

export const getStatusBadgeVariant = (
  status: CardStatus
): 'default' | 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    case 'completed':
      return 'default'
    default:
      return 'default'
  }
}

export const getStatusText = (status: CardStatus): string => {
  switch (status) {
    case 'pending':
      return 'На согласовании'
    case 'approved':
      return 'Согласовано'
    case 'rejected':
      return 'Отклонено'
    case 'completed':
      return 'Пройдено'
    default:
      return ''
  }
}
