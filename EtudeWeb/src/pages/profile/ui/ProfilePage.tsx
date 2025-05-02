// src/pages/profile/ui/ProfilePage.tsx
import React, { useState } from 'react'
import { Container } from '@/shared/ui/container'
import { Tag } from '@/shared/ui/tag'
import { SortState, Table } from '@/widgets/table'
import { Typography } from '@/shared/ui/typography'
import { useAuth } from '@/entities/session'
import { Spinner } from '@/shared/ui/spinner'
import { UserInitials } from '@/entities/profile'
import { useUserCompetencies, useUserPastEvents } from '@/entities/profile'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { Button } from '@/shared/ui/button'
import { Add } from '@mui/icons-material'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()

  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null
  })

  // Запросы на данные пользователя
  const { data: competencies, isLoading: isLoadingCompetencies } = useUserCompetencies()
  const { data: pastEvents, isLoading: isLoadingEvents } = useUserPastEvents()

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Typography variant="h2">Пользователь не авторизован</Typography>
      </div>
    )
  }

  // Колонки таблицы для прошедших мероприятий
  const columns = [
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '45%'
    },
    {
      id: 'type',
      header: 'Тип',
      accessor: 'type',
      sortable: true,
      width: '15%'
    },
    {
      id: 'format',
      header: 'Формат',
      accessor: 'format',
      sortable: true,
      width: '10%'
    },
    {
      id: 'direction',
      header: 'Направление',
      accessor: 'direction',
      sortable: true,
      width: '10%'
    },
    {
      id: 'date',
      header: 'Дата проведения',
      accessor: 'date',
      sortable: true,
      width: '20%'
    }
  ]

  return (
    <div className="flex flex-col gap-6 lg:h-full">
      {/* Блок с информацией о сотруднике */}
      <Container>
        <div className="flex items-center gap-6">
          <UserInitials user={user} />
          <div className="flex flex-col gap-1">
            <Typography variant="h2Regular">{`${user.surname} ${user.name}`}</Typography>
            <Typography variant="b2Regular" className="text-mono-800">
              {user.position || 'Должность не указана'}, {user.department || 'Отдел не указан'}
            </Typography>
          </div>
        </div>
      </Container>
      <div className="flex flex-col gap-6 lg:flex-row lg:h-full">
        {/* Блок компетенций */}
        <Container className="lg:w-[460px] lg:h-fit">
          <Typography variant="h2Regular" className="mb-4">
            Компетенции
          </Typography>

          {isLoadingCompetencies ? (
            <div className="flex justify-center py-4">
              <Spinner size="medium" label="Загрузка компетенций..." />
            </div>
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

        {/* Блок прошедших мероприятий */}
        <Container className="flex-1 overflow-x-auto flex flex-col">
          <Typography variant="h2Regular" className="mb-4">
            Прошедшие мероприятия
          </Typography>

          {isLoadingEvents ? (
            <div className="flex justify-center py-4">
              <Spinner size="medium" label="Загрузка мероприятий..." />
            </div>
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
