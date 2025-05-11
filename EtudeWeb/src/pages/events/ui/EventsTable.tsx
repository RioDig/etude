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

  // Обработчик клика по строке таблицы
  const handleRowClick = (row: unknown) => {
    onEventSelect(row as Event)
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
      id: 'startDate',
      header: 'Даты проведения',
      sortable: true,
      accessor: 'startDate',
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

  // Вспомогательные функции для отображения данных
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'На согласовании', variant: 'warning' as const }
      case 'approved':
        return { text: 'Согласовано', variant: 'success' as const }
      case 'rejected':
        return { text: 'Отклонено', variant: 'error' as const }
      case 'completed':
        return { text: 'Пройдено', variant: 'default' as const }
      default:
        return { text: status, variant: 'default' as const }
    }
  }

  const getEventTypeName = (type: string) => {
    const types = {
      conference: 'Конференция',
      course: 'Курс',
      webinar: 'Вебинар',
      training: 'Тренинг'
    }
    return types[type as keyof typeof types] || type
  }

  const getFormatName = (format: string) => {
    const formats = {
      offline: 'Очно',
      online: 'Онлайн',
      mixed: 'Смешанный'
    }
    return formats[format as keyof typeof formats] || format
  }

  const getCategoryName = (category: string) => {
    const categories = {
      'hard-skills': 'Hard Skills',
      'soft-skills': 'Soft Skills',
      management: 'Management'
    }
    return categories[category as keyof typeof categories] || category
  }

  const formatDate = (date: Date | string) => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('ru-RU')
  }

  // Компонент пустого состояния
  const emptyComponent = (
    <div className="flex justify-center my-auto">
      <EmptyMessage
        variant="small"
        imageUrl={EmptyStateSvg}
        title={error ? 'Ошибка загрузки данных' : 'Нет данных для отображения'}
        description={error || 'В системе пока нет мероприятий или они были отфильтрованы'}
      />
    </div>
  )

  // Компонент загрузки
  const loadingComponent = (
    <div className="flex justify-center items-center p-8">
      <Spinner size="large" label="Загрузка мероприятий..." />
    </div>
  )

  return (
    <div className="h-full overflow-auto">
      <Table
        data={isLoading ? [] : events}
        columns={columns}
        sortState={sortState}
        onSort={handleSort}
        loading={isLoading}
        rowClassName="cursor-pointer"
        onRowClick={(event: Event) => onEventSelect(event)}
        className="h-full flex flex-col"
        emptyComponent={isLoading ? loadingComponent : emptyComponent}
      />
    </div>
  )
}

export default EventsTable
