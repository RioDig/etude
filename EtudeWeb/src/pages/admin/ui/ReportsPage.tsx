import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { useReports, useDownloadReport, Report } from '@/entities/report'
import { MoreHoriz, Download, Add } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { notification } from '@/shared/lib/notification'
import { Typography } from '@/shared/ui/typography'

export const ReportsPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'formationDate',
    direction: 'desc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Используем хуки для загрузки данных и скачивания отчетов
  const { data: reports, isLoading, error } = useReports()
  const { mutate: downloadReport, isPending: isDownloading } = useDownloadReport()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип отчета',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'Отчет по завершенным обучениям', label: 'По завершенным обучениям' },
        { value: 'Отчет по текущим заявкам', label: 'По текущим заявкам' },
        { value: 'Отчет по бюджету на обучение', label: 'По бюджету на обучение' },
        { value: 'Отчет по статусам заявок', label: 'По статусам заявок' },
        { value: 'Отчет по эффективности обучений', label: 'По эффективности обучений' },
        { value: 'Отчет по затратам на обучение', label: 'По затратам на обучение' },
        { value: 'Отчет по участникам обучений', label: 'По участникам обучений' },
        { value: 'Отчет по согласованиям', label: 'По согласованиям' },
        { value: 'Отчет по центрам обучения', label: 'По центрам обучения' },
        { value: 'Отчет по направлениям', label: 'По направлениям' }
      ]
    },
    {
      id: 'formationDate',
      label: 'Дата формирования',
      type: 'date'
    }
  ]

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const handleAddReport = () => {
    console.log('Generate new report')
    // Здесь будет логика генерации отчета
  }

  // Обработчик скачивания отчета
  const handleDownloadReport = (report: Report) => {
    setOpenDropdownId(null)

    downloadReport(report.id, {
      onSuccess: () => {
        notification.success({
          title: 'Успешно',
          description: 'Отчет успешно скачан'
        })
      },
      onError: () => {
        notification.error({
          title: 'Ошибка',
          description: 'Не удалось скачать отчет'
        })
      }
    })
  }

  // Колонки таблицы
  const columns = [
    {
      id: 'formationDate',
      header: 'Дата формирования',
      accessor: 'formationDate',
      sortable: true,
      width: '20%'
    },
    {
      id: 'type',
      header: 'Тип',
      accessor: 'type',
      sortable: true,
      width: '70%'
    },
    {
      id: 'actions',
      header: '',
      width: '10%',
      render: (report: Report) => {
        const isOpen = openDropdownId === report.id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : report.id)}
              className="!p-2"
              id={`report-actions-${report.id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`report-actions-${report.id}`)}
              position="bottom-right"
              defaultItems={[
                {
                  label: 'Скачать отчет',
                  icon: <Download />,
                  onClick: () => handleDownloadReport(report),
                  disabled: isDownloading
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
      title={error ? 'Ошибка загрузки данных' : 'Нет отчетов'}
      description={
        error ? String(error) : 'По заданным фильтрам нет отчетов, либо их нет в системе'
      }
      className={'my-auto'}
    />
  )

  // Компонент загрузки
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка отчетов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <Typography variant={'h1'}>Отчетность</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleAddReport}>
          Сформировать отчет
        </Button>
      </div>

      {/* Фильтры */}
      <Filter filters={filterOptions} pageId="admin-reports" />

      {/* Таблица */}
      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : reports || []}
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          loading={isLoading}
          emptyComponent={isLoading ? loadingComponent : emptyComponent}
          infiniteScroll={true}
        />
      </div>
    </div>
  )
}
