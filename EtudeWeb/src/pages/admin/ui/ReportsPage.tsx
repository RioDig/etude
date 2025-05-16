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
import { ReportGenerationSidebar } from '@/features/admin/ui/ReportGenerationSidebar'
import { useQueryClient } from '@tanstack/react-query'

export const ReportsPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'report_createDate',
    direction: 'desc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const queryClient = useQueryClient()
  const { data: reports, isLoading, error } = useReports()
  const { mutate: downloadReport, isPending: isDownloading } = useDownloadReport()

  const filterOptions: FilterOption[] = [
    {
      id: 'filter_type',
      label: 'Тип отчета',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'CompletedTraining', label: 'По завершенным обучениям' }
      ]
    },
    {
      id: 'date',
      label: 'Дата создания',
      type: 'date'
    }
  ]

  const handleFilterChange = (_filterId: string, value: string | Date | null) => {
    if (value === '' || value === null) {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    }
  }

  const handleResetFilters = () => {
    queryClient.invalidateQueries({ queryKey: ['reports'] })
  }

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const handleDownloadReport = (report: Report) => {
    setOpenDropdownId(null)

    downloadReport(report.report_id, {
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

  const handleOpenGenerationSidebar = () => {
    setIsSidebarOpen(true)
  }

  const handleCloseGenerationSidebar = () => {
    setIsSidebarOpen(false)
  }

  const columns = [
    {
      id: 'report_createDate',
      header: 'Дата формирования',
      accessor: 'report_createDate',
      sortable: true,
      width: '30%',
      render: (report: Report) => {
        const date = new Date(report.report_createDate)
        return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    {
      id: 'report_type',
      header: 'Тип',
      accessor: 'report_type',
      sortable: true,
      width: '60%',
      render: (report: Report) => {
        const typeMap: Record<string, string> = {
          CompletedTraining: 'Отчет по завершенным обучениям'
        }
        return typeMap[report.report_type] || report.report_type
      }
    },
    {
      id: 'actions',
      header: '',
      width: '10%',
      render: (report: Report) => {
        const isOpen = openDropdownId === report.report_id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : report.report_id)}
              className="!p-2"
              id={`report-actions-${report.report_id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`report-actions-${report.report_id}`)}
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

  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка отчетов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <Typography variant={'h1'}>Отчетность</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleOpenGenerationSidebar}>
          Сформировать отчет
        </Button>
      </div>

      <Filter
        filters={filterOptions}
        pageId="admin-reports"
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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

      <ReportGenerationSidebar open={isSidebarOpen} onClose={handleCloseGenerationSidebar} />
    </div>
  )
}
