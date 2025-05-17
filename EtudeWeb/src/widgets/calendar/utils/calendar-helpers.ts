
import { StatusType } from '@/shared/types'

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

export const getStatusColor = (status: StatusType | undefined): string => {
  switch (status) {
    case StatusType.Approvement:
      return 'border-yellow-300 bg-yellow-100 hover:bg-yellow-200'
    case StatusType.Registered:
      return 'border-green-300 bg-green-100 hover:bg-green-200'
    case StatusType.Rejected:
      return 'border-red-300 bg-red-100 hover:bg-red-200'
    case StatusType.Processed:
      return 'border-blue-200 bg-blue-50 hover:bg-blue-100'
    case StatusType.Confirmation:
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
    default:
      return 'border-mono-300 bg-mono-100 hover:bg-mono-300'
  }
}

export const getCommentColorVariant = (
  status: StatusType | string
) => {
  switch (status) {
    case StatusType.Approvement:
      return 'border-yellow-300'
    case StatusType.Registered:
      return 'border-green-300'
    case StatusType.Rejected:
      return 'border-red-300'
    case StatusType.Processed:
      return 'border-blue-200'
    case StatusType.Confirmation:
      return 'border-mono-300'
    default:
      return 'border-mono-300'
  }
}

export const getStatusText = (status: string): string => {
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
