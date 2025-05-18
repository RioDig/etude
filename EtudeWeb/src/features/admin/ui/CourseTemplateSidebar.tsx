import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Control } from '@/shared/ui/controls'
import {
  CourseTemplate,
  useCreateCourseTemplate,
  useUpdateCourseTemplate
} from '@/entities/courseTemplate'
import { notification } from '@/shared/lib/notification'
import { formatDate } from '@/shared/utils/formatDate.ts'

interface CourseTemplateSidebarProps {
  open: boolean
  onClose: () => void
  template: CourseTemplate | null
}

export const CourseTemplateSidebar: React.FC<CourseTemplateSidebarProps> = ({
  open,
  onClose,
  template
}) => {
  const [formValues, setFormValues] = useState<Partial<CourseTemplate>>({
    course_template_name: '',
    course_template_description: '',
    course_template_type: '',
    course_template_track: '',
    course_template_format: '',
    course_template_trainingCenter: '',
    course_template_startDate: null,
    course_template_endDate: null,
    course_template_link: ''
  })

  const createMutation = useCreateCourseTemplate()
  const updateMutation = useUpdateCourseTemplate()

  useEffect(() => {
    if (template) {
      setFormValues(template)
    } else {
      setFormValues({
        course_template_name: '',
        course_template_description: '',
        course_template_type: '',
        course_template_track: '',
        course_template_format: '',
        course_template_trainingCenter: '',
        course_template_startDate: null,
        course_template_endDate: null,
        course_template_link: ''
      })
    }
  }, [template, open])

  const handleInputChange = (field: keyof CourseTemplate, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateChange = (field: string, date: Date | null) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: date ? formatDate(date) : null
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    return !!(
      formValues.course_template_name &&
      formValues.course_template_type &&
      formValues.course_template_format &&
      formValues.course_template_track
    )
  }

  const handleSave = () => {
    if (!isFormValid()) {
      notification.error({
        title: 'Ошибка валидации',
        description: 'Пожалуйста, заполните все обязательные поля'
      })
      return
    }

    if (template) {
      updateMutation.mutate(
        {
          ...formValues,
          course_template_id: template.course_template_id
        } as CourseTemplate,
        {
          onSuccess: () => {
            notification.success({
              title: 'Успешно',
              description: 'Мероприятие успешно обновлено'
            })
            onClose()
          },
          onError: () => {
            notification.error({
              title: 'Ошибка',
              description: 'Не удалось обновить мероприятие'
            })
          }
        }
      )
    } else {
      createMutation.mutate(formValues as Omit<CourseTemplate, 'course_template_id'>, {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Мероприятие успешно создано'
          })
          onClose()
        },
        onError: () => {
          notification.error({
            title: 'Ошибка',
            description: 'Не удалось создать мероприятие'
          })
        }
      })
    }
  }

  const sidebarActions: SidebarAction[] = [
    {
      label: 'Отмена',
      onClick: onClose,
      variant: 'secondary'
    },
    {
      label: template ? 'Сохранить' : 'Создать',
      onClick: handleSave,
      variant: 'primary',
      disabled: !isFormValid() || createMutation.isPending || updateMutation.isPending
    }
  ]

  const typeOptions = [
    { value: 'Course', label: 'Курс' },
    { value: 'Conference', label: 'Конференция' },
    { value: 'Certification', label: 'Сертификация' },
    { value: 'Workshop', label: 'Мастер-класс' }
  ]

  const trackOptions = [
    { value: 'HardSkills', label: 'Hard Skills' },
    { value: 'SoftSkills', label: 'Soft Skills' },
    { value: 'ManagementSkills', label: 'Management Skills' }
  ]

  const formatOptions = [
    { value: 'Online', label: 'Онлайн' },
    { value: 'Offline', label: 'Очно' }
  ]

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title={template ? 'Редактирование мероприятия' : 'Добавление мероприятия'}
      footerActions={sidebarActions}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Control.Input
            label="Название"
            required
            value={formValues.course_template_name || ''}
            onChange={(e) => handleInputChange('course_template_name', e.target.value)}
          />

          <Control.Select
            label="Тип"
            required
            value={formValues.course_template_type || ''}
            onChange={(value) => handleSelectChange('course_template_type', value)}
            options={typeOptions}
          />

          <Control.Select
            label="Направление"
            required
            value={formValues.course_template_track || ''}
            onChange={(value) => handleSelectChange('course_template_track', value)}
            options={trackOptions}
          />

          <Control.Select
            label="Формат"
            required
            value={formValues.course_template_format || ''}
            onChange={(value) => handleSelectChange('course_template_format', value)}
            options={formatOptions}
          />

          <Control.Input
            label="Учебный центр"
            value={formValues.course_template_trainingCenter || ''}
            onChange={(e) => handleInputChange('course_template_trainingCenter', e.target.value)}
          />

          <Control.Input
            label="Ссылка или место проведения"
            value={formValues.course_template_link || ''}
            onChange={(e) => handleInputChange('course_template_link', e.target.value)}
          />

          <Control.DateInput
            label="Дата начала"
            value={
              formValues.course_template_startDate
                ? new Date(formValues.course_template_startDate)
                : null
            }
            onChange={(date) => handleDateChange('course_template_startDate', date)}
          />

          <Control.DateInput
            label="Дата окончания"
            value={
              formValues.course_template_endDate
                ? new Date(formValues.course_template_endDate)
                : null
            }
            onChange={(date) => handleDateChange('course_template_endDate', date)}
          />
        </div>

        <Control.Textarea
          label="Описание"
          value={formValues.course_template_description || ''}
          onChange={(e) => handleInputChange('course_template_description', e.target.value)}
          rows={4}
        />
      </div>
    </Sidebar>
  )
}
