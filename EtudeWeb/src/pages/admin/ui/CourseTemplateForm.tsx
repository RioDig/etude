import React, { useEffect } from 'react'
import { Control } from '@/shared/ui/controls'
import {
  CourseTemplate,
  useCreateCourseTemplate,
  useUpdateCourseTemplate
} from '@/entities/courseTemplate'
import { notification } from '@/shared/lib/notification'
import { useForm } from '@/shared/hooks/useForm'

interface CourseTemplateFormProps {
  initialData: CourseTemplate | null
  onSuccess: () => void
}

interface FormValues {
  course_template_name: string
  course_template_description: string
  course_template_type: string
  course_template_track: string
  course_template_format: string
  course_template_trainingCenter: string
  course_template_startDate: string
  course_template_endDate: string
  course_template_link: string
}

export const CourseTemplateForm: React.FC<CourseTemplateFormProps> = ({
  initialData,
  onSuccess
}) => {
  const createMutation = useCreateCourseTemplate()
  const updateMutation = useUpdateCourseTemplate()

  // Инициализация формы с начальными данными
  const { values, errors, handleChange, handleSubmit, setFieldValue, reset } = useForm<FormValues>({
    initialValues: {
      course_template_name: initialData?.course_template_name || '',
      course_template_description: initialData?.course_template_description || '',
      course_template_type: initialData?.course_template_type || '',
      course_template_track: initialData?.course_template_track || '',
      course_template_format: initialData?.course_template_format || '',
      course_template_trainingCenter: initialData?.course_template_trainingCenter || '',
      course_template_startDate: initialData?.course_template_startDate
        ? new Date(initialData.course_template_startDate).toISOString().split('T')[0]
        : '',
      course_template_endDate: initialData?.course_template_endDate
        ? new Date(initialData.course_template_endDate).toISOString().split('T')[0]
        : '',
      course_template_link: initialData?.course_template_link || ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof FormValues, string>> = {}

      if (!values.course_template_name) {
        errors.course_template_name = 'Название обязательно'
      }

      if (!values.course_template_type) {
        errors.course_template_type = 'Тип обязательно'
      }

      if (!values.course_template_track) {
        errors.course_template_track = 'Направление обязательно'
      }

      if (!values.course_template_format) {
        errors.course_template_format = 'Формат обязательно'
      }

      return errors
    },
    onSubmit: (values) => {
      if (initialData) {
        // Обновление существующего шаблона
        updateMutation.mutate(
          {
            ...values,
            course_template_id: initialData.course_template_id
          },
          {
            onSuccess: () => {
              notification.success({
                title: 'Успешно',
                description: 'Шаблон курса успешно обновлен'
              })
              onSuccess()
            },
            onError: () => {
              notification.error({
                title: 'Ошибка',
                description: 'Не удалось обновить шаблон курса'
              })
            }
          }
        )
      } else {
        // Создание нового шаблона
        createMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              title: 'Успешно',
              description: 'Шаблон курса успешно создан'
            })
            onSuccess()
          },
          onError: () => {
            notification.error({
              title: 'Ошибка',
              description: 'Не удалось создать шаблон курса'
            })
          }
        })
      }
    }
  })

  // Сбрасываем форму при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset({
        course_template_name: initialData.course_template_name,
        course_template_description: initialData.course_template_description || '',
        course_template_type: initialData.course_template_type,
        course_template_track: initialData.course_template_track,
        course_template_format: initialData.course_template_format,
        course_template_trainingCenter: initialData.course_template_trainingCenter || '',
        course_template_startDate: initialData.course_template_startDate
          ? new Date(initialData.course_template_startDate).toISOString().split('T')[0]
          : '',
        course_template_endDate: initialData.course_template_endDate
          ? new Date(initialData.course_template_endDate).toISOString().split('T')[0]
          : '',
        course_template_link: initialData.course_template_link || ''
      })
    } else {
      reset({
        course_template_name: '',
        course_template_description: '',
        course_template_type: '',
        course_template_track: '',
        course_template_format: '',
        course_template_trainingCenter: '',
        course_template_startDate: '',
        course_template_endDate: '',
        course_template_link: ''
      })
    }
  }, [initialData, reset])

  // Обработчик изменения начальной даты
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFieldValue('course_template_startDate', date.toISOString().split('T')[0])
    } else {
      setFieldValue('course_template_startDate', '')
    }
  }

  // Обработчик изменения конечной даты
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setFieldValue('course_template_endDate', date.toISOString().split('T')[0])
    } else {
      setFieldValue('course_template_endDate', '')
    }
  }

  // Опции для выпадающих списков
  const typeOptions = [
    { value: 'Course', label: 'Курс' },
    { value: 'Conference', label: 'Конференция' },
    { value: 'Certification', label: 'Сертификация' },
    { value: 'Workshop', label: 'Мастер-класс' }
  ]

  const trackOptions = [
    { value: 'Hard Skills', label: 'Hard Skills' },
    { value: 'Soft Skills', label: 'Soft Skills' },
    { value: 'Management Skills', label: 'Management Skills' }
  ]

  const formatOptions = [
    { value: 'Online', label: 'Онлайн' },
    { value: 'Offline', label: 'Очно' }
  ]

  return (
    <form id="templateForm" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Control.Input
          label="Название"
          required
          name="course_template_name"
          value={values.course_template_name}
          onChange={handleChange}
          error={errors.course_template_name}
        />

        <Control.Select
          label="Тип"
          required
          name="course_template_type"
          value={values.course_template_type}
          onChange={(value) => setFieldValue('course_template_type', value)}
          options={typeOptions}
          error={errors.course_template_type}
        />

        <Control.Select
          label="Направление"
          required
          name="course_template_track"
          value={values.course_template_track}
          onChange={(value) => setFieldValue('course_template_track', value)}
          options={trackOptions}
          error={errors.course_template_track}
        />

        <Control.Select
          label="Формат"
          required
          name="course_template_format"
          value={values.course_template_format}
          onChange={(value) => setFieldValue('course_template_format', value)}
          options={formatOptions}
          error={errors.course_template_format}
        />

        <Control.Input
          label="Учебный центр"
          name="course_template_trainingCenter"
          value={values.course_template_trainingCenter}
          onChange={handleChange}
        />

        <Control.Input
          label="Ссылка или место проведения"
          name="course_template_link"
          value={values.course_template_link}
          onChange={handleChange}
        />

        <Control.DateInput
          label="Дата начала"
          value={
            values.course_template_startDate ? new Date(values.course_template_startDate) : null
          }
          onChange={handleStartDateChange}
        />

        <Control.DateInput
          label="Дата окончания"
          value={values.course_template_endDate ? new Date(values.course_template_endDate) : null}
          onChange={handleEndDateChange}
        />
      </div>

      <Control.Textarea
        label="Описание"
        name="course_template_description"
        value={values.course_template_description}
        onChange={handleChange}
        rows={4}
      />
    </form>
  )
}
