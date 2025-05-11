import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { useStatuses, AdditionalStatus } from '@/entities/status'
import { MoreHoriz, Edit, Delete } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

export const StatusesPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: 'asc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Используем хук для загрузки данных
  const { data: statuses, isLoading, error } = useStatuses()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'name',
      label: 'Поиск по названию',
      type: 'dropdown',
      options: []
    }
  ]

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
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
      description={error ? String(error) : 'В системе пока нет дополнительных статусов'}
    />
  )

  // Компонент загрузки
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка статусов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Фильтры */}
      <Filter filters={filterOptions} pageId="admin-statuses" />

      {/* Таблица */}
      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : statuses || []}
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