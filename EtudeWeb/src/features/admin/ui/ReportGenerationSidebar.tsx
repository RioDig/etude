import React, { useState } from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Control } from '@/shared/ui/controls'
import { useGenerateReport } from '@/entities/report'
import { notification } from '@/shared/lib/notification'
import { Typography } from '@/shared/ui/typography'
import { Spinner } from '@/shared/ui/spinner'
import { ReportType } from '@/shared/types'

interface ReportGenerationSidebarProps {
  open: boolean
  onClose: () => void
}

export const ReportGenerationSidebar: React.FC<ReportGenerationSidebarProps> = ({
  open,
  onClose
}) => {
  const [reportType, setReportType] = useState<string>(ReportType.CompletedTraining)

  const generateReportMutation = useGenerateReport()

  const handleGenerateReport = () => {
    generateReportMutation.mutate(undefined, {
      onSuccess: () => {
        notification.success({
          title: 'Успешно',
          description: 'Отчет успешно сгенерирован и скачан'
        })
        onClose()
      },
      onError: () => {
        notification.error({
          title: 'Ошибка',
          description: 'Не удалось сгенерировать отчет'
        })
      }
    })
  }

  const sidebarActions: SidebarAction[] = [
    {
      label: 'Отмена',
      onClick: onClose,
      variant: 'secondary'
    },
    {
      label: 'Создать и скачать',
      onClick: handleGenerateReport,
      variant: 'primary',
      disabled: generateReportMutation.isPending
    }
  ]

  const reportTypeOptions = [
    { value: ReportType.CompletedTraining, label: 'Отчет по завершенным обучениям' }
  ]

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title="Формирование отчета"
      footerActions={sidebarActions}
    >
      <div className="space-y-6">
        <Typography variant="b3Regular">
          Выберите тип отчета, который нужно сформировать. Отчет будет автоматически скачан после
          формирования.
        </Typography>

        <Control.Select
          label="Тип отчета"
          required
          value={reportType}
          onChange={(value) => setReportType(value)}
          options={reportTypeOptions}
        />

        {generateReportMutation.isPending && (
          <div className="flex items-center justify-center py-4">
            <Spinner size="medium" label="Формирование отчета..." />
          </div>
        )}
      </div>
    </Sidebar>
  )
}
