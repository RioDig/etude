// src/pages/admin/ui/StatusesPage.tsx
import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { useStatuses, AdditionalStatus } from '@/entities/status'
import { MoreHoriz, Edit, Delete, Add } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { Container } from '@/shared/ui/container'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'

export const StatusesPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: 'asc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Используем хук для загрузки данных
  const { data: statuses, isLoading, error } = useStatuses()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'name',
      label: 'Название',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все статусы' },
        ...(statuses?.map((status) => ({
          value: status.name,
          label: status.name
        })) || [])
      ]
    }
  ]

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  // Обработчик поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Обработчик добавления статуса
  const handleAddStatus = () => {
    console.log('Add new status')
    // Здесь будет логика добавления статуса
  }

  // Обработчик действий
  const handleAction = (action: string, status: AdditionalStatus) => {
    setOpenDropdownId(null)

    switch (action) {
      case 'edit':
        console.log('Edit status:', status)
        // Здесь будет логика редактирования
        break
      case 'delete':
        console.log('Delete status:', status)
        // Здесь будет логика удаления
        break
    }
  }

  // Фильтрация статусов по поисковому запросу
  const filteredStatuses =
    statuses?.filter(
      (status) => searchTerm === '' || status.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Колонки таблицы
  const columns = [
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '30%'
    },
    {
      id: 'description',
      header: 'Описание',
      accessor: 'description',
      sortable: true,
      width: '60%'
    },
    {
      id: 'actions',
      header: '',
      width: '10%',
      render: (status: AdditionalStatus) => {
        const isOpen = openDropdownId === status.id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : status.id)}
              className="!p-2"
              id={`status-actions-${status.id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`status-actions-${status.id}`)}
              position="bottom-right"
              defaultItems={[
                {
                  label: 'Редактировать',
                  icon: <Edit />,
                  onClick: () => handleAction('edit', status)
                }
              ]}
              warningItems={[
                {
                  label: 'Удалить',
                  icon: <Delete />,
                  onClick: () => handleAction('delete', status)
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  // Компонент пустого состояния
  const emptyComponent = (
    <EmptyMessage
      variant="small"
      imageUrl={EmptyStateSvg}
      title={error ? 'Ошибка загрузки данных' : 'Нет дополнительных статусов'}
      description={
        error
          ? String(error)
          : 'По заданному запросу нет дополнительных статусов, либо их нет в системе'
      }
      className={'my-auto'}
    />
  )

  // Компонент загрузки
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка статусов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h1">Дополнительные статусы</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleAddStatus}>
          Добавить статус
        </Button>
      </div>

      {/* Поиск */}
      <div className="w-full">
        <Control.Input
          placeholder="Поиск по названию статуса..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Фильтры */}
      {/*<Filter filters={filterOptions} pageId="admin-statuses" />*/}

      {/* Таблица */}
      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : filteredStatuses}
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          loading={isLoading}
          emptyComponent={isLoading ? loadingComponent : emptyComponent}
        />
      </div>
    </div>
  )
}
