import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { useTemplates, Template } from '@/entities/template'
import { MoreHoriz, Edit, Delete } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'

export const TemplatesPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: 'asc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Используем хук для загрузки данных
  const { data: templates, isLoading, error } = useTemplates()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'Курс', label: 'Курс' },
        { value: 'Конференция', label: 'Конференция' },
        { value: 'Вебинар', label: 'Вебинар' },
        { value: 'Тренинг', label: 'Тренинг' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'Онлайн', label: 'Онлайн' },
        { value: 'Очно', label: 'Очно' },
        { value: 'Смешанный', label: 'Смешанный' }
      ]
    },
    {
      id: 'category',
      label: 'Направление',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все направления' },
        { value: 'Hard Skills', label: 'Hard Skills' },
        { value: 'Soft Skills', label: 'Soft Skills' },
        { value: 'Management', label: 'Management' }
      ]
    }
  ]

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  // Обработчик действий
  const handleAction = (action: string, template: Template) => {
    setOpenDropdownId(null)

    switch (action) {
      case 'edit':
        console.log('Edit template:', template)
        // Здесь будет логика редактирования
        break
      case 'delete':
        console.log('Delete template:', template)
        // Здесь будет логика удаления
        break
    }
  }

  // Колонки таблицы
  const columns = [
    {
      id: 'type',
      header: 'Тип',
      accessor: 'type',
      sortable: true,
      width: '10%'
    },
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '25%'
    },
    {
      id: 'duration',
      header: 'Длительность',
      sortable: true,
      width: '10%',
      render: (template: Template) => template.duration || '—'
    },
    {
      id: 'format',
      header: 'Формат',
      accessor: 'format',
      sortable: true,
      width: '10%'
    },
    {
      id: 'category',
      header: 'Направление',
      accessor: 'category',
      sortable: true,
      width: '10%'
    },
    {
      id: 'trainingCenter',
      header: 'Центр обучения',
      sortable: true,
      width: '20%',
      render: (template: Template) => template.trainingCenter || '—'
    },
    {
      id: 'startDate',
      header: 'Дата начала',
      sortable: true,
      width: '10%',
      render: (template: Template) => {
        if (!template.startDate) return '—'
        return new Date(template.startDate).toLocaleDateString('ru-RU')
      }
    },
    {
      id: 'endDate',
      header: 'Дата окончания',
      sortable: true,
      width: '10%',
      render: (template: Template) => {
        if (!template.endDate) return '—'
        return new Date(template.endDate).toLocaleDateString('ru-RU')
      }
    },
    {
      id: 'actions',
      header: '',
      width: '5%',
      render: (template: Template) => {
        const isOpen = openDropdownId === template.id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : template.id)}
              className="!p-2"
              id={`template-actions-${template.id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`template-actions-${template.id}`)}
              position="bottom-right"
              defaultItems={[
                {
                  label: 'Редактировать',
                  icon: <Edit />,
                  onClick: () => handleAction('edit', template)
                }
              ]}
              warningItems={[
                {
                  label: 'Удалить',
                  icon: <Delete />,
                  onClick: () => handleAction('delete', template)
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
      title={error ? 'Ошибка загрузки данных' : 'Нет шаблонов курсов'}
      description={error ? String(error) : 'В системе пока нет шаблонов курсов'}
    />
  )

  // Компонент загрузки
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка шаблонов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Фильтры */}
      <Filter filters={filterOptions} pageId="admin-templates" />

      {/* Таблица */}
      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : templates || []}
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