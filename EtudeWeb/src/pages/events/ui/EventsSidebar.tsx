import React from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Typography } from '@/shared/ui/typography'
import { Tag } from '@/shared/ui/tag'
import { Badge } from '@/shared/ui/badge'

import { Spinner } from '@/shared/ui/spinner'
import { useEventDetails } from '@/entities/event'
import { Event } from '@/entities/event/model/types'

interface EventsSidebarProps {
  open: boolean
  onClose: () => void
  event: Event | null
}

export const EventsSidebar: React.FC<EventsSidebarProps> = ({ open, onClose, event }) => {
  const {
    data: eventDetails,
    isLoading,
    error
  } = useEventDetails(event?.id, {
    enabled: !!event && open
  })

  const headerActions: SidebarAction[] = [
    {
      label: 'Редактировать',
      onClick: () => {
        console.log('Edit event', event?.id)
      },
      variant: 'secondary'
    }
  ]

  const footerActions: SidebarAction[] = [
    {
      label: 'Закрыть',
      onClick: onClose,
      variant: 'secondary'
    }
  ]

  const getStatusInfo = (
    status: string
  ): { text: string; variant: 'default' | 'error' | 'warning' | 'success' | 'system' } => {
    switch (status) {
      case 'pending':
        return { text: 'На согласовании', variant: 'warning' }
      case 'approved':
        return { text: 'Согласовано', variant: 'success' }
      case 'rejected':
        return { text: 'Отклонено', variant: 'error' }
      case 'completed':
        return { text: 'Пройдено', variant: 'default' }
      default:
        return { text: status, variant: 'default' }
    }
  }

  const getEventTypeName = (type: string): string => {
    switch (type) {
      case 'conference':
        return 'Конференция'
      case 'course':
        return 'Курс'
      case 'webinar':
        return 'Вебинар'
      case 'training':
        return 'Тренинг'
      default:
        return type
    }
  }

  const getFormatName = (format: string): string => {
    switch (format) {
      case 'offline':
        return 'Очно'
      case 'online':
        return 'Онлайн'
      case 'mixed':
        return 'Смешанный'
      default:
        return format
    }
  }

  const getCategoryName = (category: string): string => {
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

  const formatDate = (date: Date | string): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ru-RU')
  }

  if (!event) {
    return null
  }

  const eventData = eventDetails || event
  const { text: statusText, variant: statusVariant } = getStatusInfo(eventData.status)

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title={eventData.title}
      description={`${getEventTypeName(eventData.type)}, ${getFormatName(eventData.format)}`}
      badge={{ text: statusText, variant: statusVariant }}
      headerActions={headerActions}
      footerActions={footerActions}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="medium" label="Загрузка данных..." />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          <Typography variant="b3Regular">
            Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="b3Semibold" className="mb-2">
              Основная информация
            </Typography>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <span className="text-mono-700 w-32">Тип:</span>
                <span>{getEventTypeName(eventData.type)}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-mono-700 w-32">Формат:</span>
                <Tag>{getFormatName(eventData.format)}</Tag>
              </div>
              <div className="flex gap-2">
                <span className="text-mono-700 w-32">Направление:</span>
                <Tag>{getCategoryName(eventData.category)}</Tag>
              </div>
              <div className="flex gap-2">
                <span className="text-mono-700 w-32">Период:</span>
                <span>
                  {formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}
                </span>
              </div>
            </div>
          </div>

          {eventData.description && (
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Описание
              </Typography>
              <div className="text-b3-regular whitespace-pre-wrap">{eventData.description}</div>
            </div>
          )}

          {eventDetails && eventDetails.location && (
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Место проведения
              </Typography>
              <div className="text-b3-regular">{eventDetails.location}</div>
            </div>
          )}

          {eventDetails && eventDetails.participants && eventDetails.participants.length > 0 && (
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Участники
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventDetails.participants.map((participant, index) => (
                  <div key={index} className="flex gap-2 items-center p-2 bg-mono-100 rounded">
                    <div className="text-b3-regular">{participant.name}</div>
                    {participant.position && (
                      <div className="text-b4-regular text-mono-700">({participant.position})</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {eventDetails && eventDetails.approvers && eventDetails.approvers.length > 0 && (
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Согласующие
              </Typography>
              <div className="flex flex-col gap-3">
                {eventDetails.approvers.map((approver, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-mono-100 rounded"
                  >
                    <div>
                      <div className="text-b3-regular">{approver.name}</div>
                      {approver.position && (
                        <div className="text-b4-regular text-mono-700">{approver.position}</div>
                      )}
                    </div>
                    <Badge variant={approver.approved ? 'success' : 'default'}>
                      {approver.approved ? 'Согласовано' : 'Ожидание'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Sidebar>
  )
}

export default EventsSidebar
