import React from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Typography } from '@/shared/ui/typography'
import { Spinner } from '@/shared/ui/spinner'
import { useScheduleTemplate } from '@/entities/schedule'
import { CourseFormatLabels } from '@/shared/labels/courseFormat'
import { CourseTypeLabels } from '@/shared/labels/courseType'

interface ScheduleSidebarProps {
  open: boolean
  onClose: () => void
  templateId: string | null
}

export const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({ open, onClose, templateId }) => {
  const { data: template, isLoading, error } = useScheduleTemplate(templateId || undefined)

  const footerActions: SidebarAction[] = [
    {
      label: 'Закрыть',
      onClick: onClose,
      variant: 'secondary'
    }
  ]

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указана'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  if (!templateId) {
    return null
  }

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title={template?.course_template_name || 'Загрузка...'}
      description={template ? CourseTypeLabels[template.course_template_type] : ''}
      footerActions={footerActions}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="medium" label="Загрузка данных..." />
        </div>
      ) : error ? (
        <Typography variant="b3Regular" className="text-red-500">
          Произошла ошибка при загрузке данных
        </Typography>
      ) : template ? (
        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="b3Semibold" className="mb-2">
              Основная информация
            </Typography>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-mono-700">Тип:</span>
                <span>{CourseTypeLabels[template.course_template_type]}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-mono-700">Формат:</span>
                <span>{CourseFormatLabels[template.course_template_format]}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-mono-700">Направление:</span>
                <span>{template.course_template_track}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-mono-700">Период:</span>
                <span>
                  {formatDate(template.course_template_startDate)} -{' '}
                  {formatDate(template.course_template_endDate)}
                </span>
              </div>
              <div className="grid grid-cols-[140px_1fr] gap-4">
                <span className="text-mono-700">Учебный центр:</span>
                <span>{template.course_template_trainingCenter || 'Не указан'}</span>
              </div>
              {template.course_template_link && (
                <div className="grid grid-cols-[140px_1fr] gap-4">
                  <span className="text-mono-700">Место/ссылка:</span>
                  <span>{template.course_template_link}</span>
                </div>
              )}
            </div>
          </div>

          {template.course_template_description && (
            <div>
              <Typography variant="b3Semibold" className="mb-2">
                Описание
              </Typography>
              <div className="whitespace-pre-wrap">{template.course_template_description}</div>
            </div>
          )}
        </div>
      ) : null}
    </Sidebar>
  )
}

export default ScheduleSidebar
