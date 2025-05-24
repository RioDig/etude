import React, { useState } from 'react'
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
import { Sidebar } from '@/widgets/sidebar'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()

  const [sortState, setSortState] = useState<SortState>({
    field: 'course.course_endDate',
    direction: 'desc'
  })

  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const {
    data: competencies,
    isLoading: isLoadingCompetencies,
    error: competenciesError
  } = useUserCompetencies()

  const { data: pastEvents, isLoading: isLoadingEvents, error: eventsError } = useUserPastEvents()

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const handleEventClick = (event: PastEvent) => {
    setSelectedEvent(event)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
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

  const getStatusInfo = (status?: { name: string; type: string }) => {
    if (!status) return { text: 'Не указан', variant: 'default' as const }

    switch (status.type) {
      case 'Approvement':
        return { text: status.name, variant: 'success' as const }
      case 'Rejected':
        return { text: status.name, variant: 'error' as const }
      case 'Confirmation':
        return { text: status.name, variant: 'warning' as const }
      case 'Registered':
        return { text: status.name, variant: 'system' as const }
      case 'Processed':
        return { text: status.name, variant: 'default' as const }
      default:
        return { text: status.name, variant: 'default' as const }
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:h-full">
      <Container>
        <div className="flex items-center gap-6">
          <UserInitials user={user} />
          <div className="flex flex-col gap-1">
            <Typography variant="h2Regular">{`${user.surname} ${user.name} ${user.patronymic || ''}`}</Typography>
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
          <div className="flex flex-col gap-6 h-full">
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
            <div className="flex-1 overflow-hidden">
              <Table
                data={pastEvents}
                columns={columns}
                sortState={sortState}
                onSort={handleSort}
                scrollable={true}
                infiniteScroll={true}
                height='500px'
                onRowClick={handleEventClick}
                rowClassName="cursor-pointer"
                className="max-h-[500px]"
              />
            </div>
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
          </div>
        </Container>
      </div>

      {selectedEvent && (
        <Sidebar
          open={isSidebarOpen}
          onClose={handleCloseSidebar}
          title={selectedEvent.course.course_name}
          description={
            CourseTypeLabels[selectedEvent.course.course_type] || selectedEvent.course.course_type
          }
          footerActions={[
            {
              label: 'Закрыть',
              onClick: handleCloseSidebar,
              variant: 'secondary'
            }
          ]}
        >
          <div className="flex flex-col gap-6">
            <section>
              <Typography variant="b3Semibold" className="mb-4">
                Информация о мероприятии
              </Typography>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Тип:</span>
                  <span className="text-mono-950">
                    {CourseTypeLabels[selectedEvent.course.course_type] ||
                      selectedEvent.course.course_type}
                  </span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Формат:</span>
                  <span className="text-mono-950">
                    {CourseFormatLabels[selectedEvent.course.course_format] ||
                      selectedEvent.course.course_format}
                  </span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Направление:</span>
                  <span className="text-mono-950">{selectedEvent.course.course_track}</span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Период проведения:</span>
                  <span className="text-mono-950">
                    {formatDate(selectedEvent.course.course_startDate)} -{' '}
                    {formatDate(selectedEvent.course.course_endDate)}
                  </span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Учебный центр:</span>
                  <span className="text-mono-950">
                    {selectedEvent.course.course_trainingCenter || '—'}
                  </span>
                </div>
              </div>
            </section>

            {selectedEvent.course.course_description && (
              <section>
                <Typography variant="b3Semibold" className="mb-4">
                  Описание
                </Typography>
                <Typography variant="b3Regular">
                  {selectedEvent.course.course_description}
                </Typography>
              </section>
            )}

            <section>
              <Typography variant="b3Semibold" className="mb-4">
                Дополнительная информация
              </Typography>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Дата создания заявки:</span>
                  <span className="text-mono-950">{formatDate(selectedEvent.created_at)}</span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Цель обучения:</span>
                  <span className="text-mono-950">
                    {selectedEvent.course.course_educationGoal || '—'}
                  </span>
                </div>
                <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                  <span className="text-mono-700 shrink-0">Стоимость:</span>
                  <span className="text-mono-950">
                    {selectedEvent.course.course_price
                      ? `${selectedEvent.course.course_price} ₽`
                      : '—'}
                  </span>
                </div>
                {selectedEvent.course.course_link && (
                  <div className="grid grid-cols-[minmax(140px,30%)_1fr] gap-4">
                    <span className="text-mono-700 shrink-0">Место проведения или ссылка:</span>
                    <span className="text-mono-950">{selectedEvent.course.course_link}</span>
                  </div>
                )}
              </div>
            </section>

            {selectedEvent.course.course_learner && (
              <section>
                <Typography variant="b3Semibold" className="mb-4">
                  Участник
                </Typography>
                <div className="flex flex-col gap-3">
                  <div className="flex">
                    <span className="text-mono-700 w-[180px]">ФИО:</span>
                    <span>
                      {selectedEvent.course.course_learner.surname}{' '}
                      {selectedEvent.course.course_learner.name}
                      {selectedEvent.course.course_learner.patronymic &&
                        ` ${selectedEvent.course.course_learner.patronymic}`}
                    </span>
                  </div>
                  {selectedEvent.course.course_learner.position && (
                    <div className="flex">
                      <span className="text-mono-700 w-[180px]">Должность:</span>
                      <span>{selectedEvent.course.course_learner.position}</span>
                    </div>
                  )}
                  {selectedEvent.course.course_learner.department && (
                    <div className="flex">
                      <span className="text-mono-700 w-[180px]">Подразделение:</span>
                      <span>{selectedEvent.course.course_learner.department}</span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </Sidebar>
      )}
    </div>
  )
}

export default ProfilePage
