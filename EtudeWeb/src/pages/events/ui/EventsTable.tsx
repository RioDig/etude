import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Tag } from '@/shared/ui/tag'
import { Badge } from '@/shared/ui/badge'
import { Spinner } from '@/shared/ui/spinner'
import { Application, ApplicationStatus, CustomStatus, StatusType } from '@/shared/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { CourseTypeLabels } from '@/shared/labels/courseType'
import { CourseFormatLabels } from '@/shared/labels/courseFormat'
import { StatusTypeLabels } from '@/shared/labels/statusType.ts'
import { CourseTrackLabels } from '@/shared/labels/courseTrack.ts'

interface EventsTableProps {
  events: Application[]
  isLoading: boolean
  error?: string
  onEventSelect: (event: Application) => void
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  error,
  onEventSelect
}) => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'created_at',
    direction: 'desc'
  })

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const getBadges = (
    status: ApplicationStatus,
    variant: 'error' | 'default' | 'warning' | 'success' | 'system'
  ): {
    text: string
    variant?: 'default' | 'error' | 'warning' | 'success' | 'system'
  }[] => {
    if (status.type === StatusType.Processed) {
      return [
        {
          text: StatusTypeLabels[StatusType.Processed],
          variant: 'system'
        },
        {
          text: status.name,
          variant: 'system'
        }
      ]
    }

    return [
      {
        // @ts-expect-error hotfix
        text: StatusTypeLabels[status.type ?? StatusType.Processed],
        variant: variant
      }
    ]
  }

  const columns = [
    {
      id: 'status.type',
      header: 'Статус',
      sortable: true,
      width: '12%',
      render: (event: Application) => {
        const { text, variant } = getStatusInfo(event.status.type)
        return (
          <div className='space-y-2'>
            {getBadges(event.status, variant).map((badge, index) => (
              <Badge variant={badge.variant} key={index}>
                {badge.text}
              </Badge>
            ))}
          </div>
        )
      }
    },
    {
      id: 'course.course_name',
      header: 'Наименование',
      accessor: 'course.course_name',
      sortable: true,
      width: '20%'
    },
    {
      id: 'course.course_type',
      header: 'Тип',
      sortable: true,
      width: '10%',
      render: (event: Application) => {
        return <Tag>{CourseTypeLabels[event.course.course_type]}</Tag>
      }
    },
    {
      id: 'course.course_format',
      header: 'Формат',
      sortable: true,
      width: '10%',
      render: (event: Application) => {
        return <Tag>{CourseFormatLabels[event.course.course_format]}</Tag>
      }
    },
    {
      id: 'course.course_track',
      header: 'Направление',
      sortable: true,
      width: '15%',
      render: (event: Application) => {
        return <Tag>{CourseTrackLabels[event.course.course_track]}</Tag>
      }
    },
    {
      id: 'course.course_startDate',
      header: 'Даты проведения',
      sortable: true,
      accessor: 'course.course_startDate',
      width: '15%',
      render: (event: Application) => {
        return (
          <span>
            {formatDate(event.course.course_startDate)} - {formatDate(event.course.course_endDate)}
          </span>
        )
      }
    },
    {
      id: 'course.course_learner.surname',
      header: 'Участник',
      sortable: true,
      accessor: 'course.course_learner',
      width: '20%',
      render: (event: Application) => {
        return (
          <div className="flex flex-col">
            <span>
              {event.course.course_learner?.surname} {event.course.course_learner?.name}{' '}
              {event.course.course_learner?.patronymic}
            </span>
            <span className="text-mono-600">
              {event.course.course_learner?.position}, {event.course.course_learner?.department}
            </span>
          </div>
        )
      }
    }
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case StatusType.Confirmation:
        return { text: StatusTypeLabels[StatusType.Confirmation], variant: 'default' as const }
      case StatusType.Approvement:
        return { text: StatusTypeLabels[StatusType.Approvement], variant: 'warning' as const }
      case StatusType.Rejected:
        return { text: StatusTypeLabels[StatusType.Rejected], variant: 'error' as const }
      case StatusType.Registered:
        return { text: StatusTypeLabels[StatusType.Registered], variant: 'success' as const }
      case StatusType.Processed:
        return { text: StatusTypeLabels[StatusType.Processed], variant: 'system' as const }
      default:
        return { text: status, variant: 'default' as const }
    }
  }

  const formatDate = (date: string) => {
    if (!date) return ''
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('ru-RU')
  }

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
        onRowClick={(event: Application) => onEventSelect(event)}
        className="h-full flex flex-col"
        emptyComponent={isLoading ? loadingComponent : emptyComponent}
      />
    </div>
  )
}

export default EventsTable
