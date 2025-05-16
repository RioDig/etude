import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { useReports, useDownloadReport, useGenerateReport, Report } from '@/entities/report'
import { MoreHoriz, Download, Add } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { notification } from '@/shared/lib/notification'
import { Typography } from '@/shared/ui/typography'
import { Modal } from '@/shared/ui/modal'

export const ReportsPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'report_createDate',
    direction: 'desc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  // Используем хуки для загрузки отчетов и операций с ними
  const { data: reports, isLoading, error } = useReports()
  const { mutate: downloadReport, isPending: isDownloading } = useDownloadReport()
  const { mutate: generateReport, isPending: isGenerating } = useGenerateReport()

  // Опции для фильтров
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

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  // Обработчик скачивания отчета
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

  // Обработчик открытия модального окна генерации отчета
  const handleOpenGenerateModal = () => {
    setIsGenerateModalOpen(true)
  }

  // Обработчик закрытия модального окна генерации отчета
  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false)
  }

  // Обработчик генерации нового отчета
  const handleGenerateReport = () => {
    generateReport(undefined, {
      onSuccess: () => {
        notification.success({
          title: 'Успешно',
          description: 'Отчет успешно сгенерирован и скачан'
        })
        setIsGenerateModalOpen(false)
      },
      onError: () => {
        notification.error({
          title: 'Ошибка',
          description: 'Не удалось сгенерировать отчет'
        })
      }
    })
  }

  // Колонки таблицы
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
        <Button variant="primary" leftIcon={<Add />} onClick={handleOpenGenerateModal}>
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

      {/* Модальное окно генерации отчета */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        title="Сформировать отчет"
        actions={
          <>
            <Button variant="secondary" onClick={handleCloseGenerateModal}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Spinner size="small" variant="white" className="mr-2" />
                  <span>Создание отчета...</span>
                </>
              ) : (
                'Создать и скачать'
              )}
            </Button>
          </>
        }
      >
        <Typography variant="b3Regular">
          Вы собираетесь сформировать отчет по завершенным обучениям. Отчет будет автоматически
          скачан после формирования.
        </Typography>
      </Modal>
    </div>
  )
}
