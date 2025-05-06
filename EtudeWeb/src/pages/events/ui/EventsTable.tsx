import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Tag } from '@/shared/ui/tag'
import { Badge } from '@/shared/ui/badge'
import { Spinner } from '@/shared/ui/spinner'
import { Event } from '@/entities/event/model/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

interface EventsTableProps {
  events: Event[]
  isLoading: boolean
  error?: string
  onEventSelect: (event: Event) => void
}

/**
 * Компонент таблицы для отображения списка мероприятий
 */
export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  error,
  onEventSelect
}) => {
  // Состояние сортировки таблицы
  const [sortState, setSortState] = useState<SortState>({
    field: 'startDate',
    direction: 'desc'
  })

  // Обработчик изменения сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  // Получение цвета и текста для статуса
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

  // Получение названия для типа мероприятия
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

  // Получение названия для формата мероприятия
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

  // Получение названия для категории мероприятия
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

  // Форматирование даты
  const formatDate = (date: Date | string): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ru-RU')
  }

  // Если идет загрузка, показываем спиннер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" label="Загрузка мероприятий..." />
      </div>
    )
  }

  // Если есть ошибка, отображаем сообщение об ошибке
  if (error) {
    return (
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title="Ошибка загрузки данных"
        description={error}
      />
    )
  }

  // Если нет мероприятий, показываем пустое состояние
  if (events.length === 0) {
    return (
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title="Нет данных для отображения"
        description="В системе пока нет мероприятий или они были отфильтрованы"
      />
    )
  }

  // Определение колонок таблицы
  const columns = [
    {
      id: 'status',
      header: 'Статус',
      sortable: true,
      width: '15%',
      render: (event: Event) => {
        const { text, variant } = getStatusInfo(event.status)
        return <Badge variant={variant}>{text}</Badge>
      }
    },
    {
      id: 'title',
      header: 'Наименование',
      accessor: 'title',
      sortable: true,
      width: '25%'
    },
    {
      id: 'type',
      header: 'Тип',
      sortable: true,
      width: '15%',
      render: (event: Event) => getEventTypeName(event.type)
    },
    {
      id: 'format',
      header: 'Формат',
      sortable: true,
      width: '10%',
      render: (event: Event) => {
        return <Tag>{getFormatName(event.format)}</Tag>
      }
    },
    {
      id: 'category',
      header: 'Направление',
      sortable: true,
      width: '15%',
      render: (event: Event) => {
        return <Tag>{getCategoryName(event.category)}</Tag>
      }
    },
    {
      id: 'period',
      header: 'Даты проведения',
      sortable: true,
      width: '20%',
      render: (event: Event) => {
        return (
          <span>
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        )
      }
    }
  ]

  // Рендер таблицы
  return (
    <Table
      data={events}
      columns={columns}
      sortState={sortState}
      onSort={handleSort}
      rowClassName="cursor-pointer"
      onRowClick={(row) => onEventSelect(row as Event)}
    />
  )
}

export default EventsTable
