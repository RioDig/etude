import React from 'react'
import { Container } from '@/shared/ui/container'
import { Tag } from '@/shared/ui/tag'
import { SortState, Table, TableColumn } from '@/widgets/table'
import { Typography } from '@/shared/ui/typography'
import { useAuth } from '@/entities/session'
import { Spinner } from '@/shared/ui/spinner'
import { UserInitials } from '@/entities/profile'
import { useUserCompetencies, useUserPastEvents } from '@/entities/profile/hooks/useProfile'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { Button } from '@/shared/ui/button'
import { Add } from '@mui/icons-material'
import { PastEvent } from '@/shared/types'
import { CourseTypeLabels } from '@/shared/labels/courseType.ts'
import { CourseFormatLabels } from '@/shared/labels/courseFormat.ts'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()

  const [sortState, setSortState] = React.useState<SortState>({
    field: 'course.course_endDate',
    direction: 'desc'
  })

  const {
    data: competencies,
    isLoading: isLoadingCompetencies,
    error: competenciesError
  } = useUserCompetencies()

  const { data: pastEvents, isLoading: isLoadingEvents, error: eventsError } = useUserPastEvents()

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указана'
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const columns: TableColumn<PastEvent>[] = [
    {
      id: 'course.course_name',
      header: 'Наименование',
      accessor: 'course.course_name',
      sortable: true,
      width: '25%',
      render: (event: PastEvent) => event.course.course_name
    },
    {
      id: 'course.course_type',
      header: 'Тип',
      accessor: 'course.course_type',
      sortable: true,
      width: '15%',
      render: (event: PastEvent) => CourseTypeLabels[event.course.course_type]
    },
    {
      id: 'course.course_format',
      header: 'Формат',
      accessor: 'course.course_format',
      sortable: true,
      width: '10%',
      render: (event: PastEvent) => CourseFormatLabels[event.course.course_format]
    },
    {
      id: 'course.course_track',
      header: 'Направление',
      accessor: 'course.course_track',
      sortable: true,
      width: '15%',
      render: (event: PastEvent) => event.course.course_track
    },
    {
      id: 'course.course_startDate',
      header: 'Дата проведения',
      accessor: 'course.course_startDate',
      sortable: true,
      width: '15%',
      render: (event: PastEvent) => (
        <span>
          {formatDate(event.course.course_startDate)} - {formatDate(event.course.course_endDate)}
        </span>
      )
    },
    {
      id: 'course.course_trainingCenter',
      header: 'Учебный центр',
      accessor: 'course.course_trainingCenter',
      sortable: true,
      width: '20%',
      render: (event: PastEvent) => event.course.course_trainingCenter || '—'
    }
  ]

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Typography variant="h2">Пользователь не авторизован</Typography>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:h-full">
      <Container>
        <div className="flex items-center gap-6">
          <UserInitials user={user} />
          <div className="flex flex-col gap-1">
            <Typography variant="h2Regular">{`${user.surname} ${user.name} ${user.patronymic}`}</Typography>
            <Typography variant="b2Regular" className="text-mono-800">
              {user.position || 'Должность не указана'},{' '}
              {user.department || 'Подразделение не указано'}
            </Typography>
          </div>
        </div>
      </Container>
      <div className="flex flex-col gap-6 lg:flex-row lg:h-full">
        <Container className="lg:w-[460px] lg:h-fit">
          <Typography variant="h2Regular" className="mb-4">
            Компетенции
          </Typography>

          {isLoadingCompetencies ? (
            <div className="flex justify-center py-4">
              <Spinner size="medium" label="Загрузка компетенций..." />
            </div>
          ) : competenciesError ? (
            <Typography variant="b3Regular" className="text-red-500">
              Ошибка загрузки компетенций: {competenciesError.message}
            </Typography>
          ) : competencies && competencies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {competencies.map((competency) => (
                <Tag key={competency.id}>{competency.name}</Tag>
              ))}
            </div>
          ) : (
            <Typography variant="b3Regular" className="text-mono-700">
              Компетенции не найдены
            </Typography>
          )}
        </Container>

        <Container className="flex-1 overflow-x-auto flex flex-col">
          <Typography variant="h2Regular" className="mb-4">
            Прошедшие мероприятия
          </Typography>

          {isLoadingEvents ? (
            <div className="flex justify-center py-4">
              <Spinner size="medium" label="Загрузка мероприятий..." />
            </div>
          ) : eventsError ? (
            <Typography variant="b3Regular" className="text-red-500">
              Ошибка загрузки мероприятий: {eventsError.message}
            </Typography>
          ) : pastEvents && pastEvents.length > 0 ? (
            <Table
              data={pastEvents}
              columns={columns}
              sortState={sortState}
              onSort={handleSort}
              scrollable={true}
            />
          ) : (
            <EmptyMessage
              variant="small"
              imageUrl={EmptyStateSvg}
              title="Нет мероприятий или пройденных обучений"
              description="Вы можете отправить заявление на обучение"
              actionButton={
                <Button className="leading-none" to={'/applications/new'} leftIcon={<Add />}>
                  Новое заявление
                </Button>
              }
              className="mr-5 leading-none"
            />
          )}
        </Container>
      </div>
    </div>
  )
}

export default ProfilePage
