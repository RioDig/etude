import React, { useEffect } from 'react'
import { Control } from '@/shared/ui/controls'
import { CustomStatus, useCreateCustomStatus, useUpdateCustomStatus } from '@/entities/customStatus'
import { notification } from '@/shared/lib/notification'
import { useForm } from '@/shared/hooks/useForm'

interface StatusFormProps {
  initialData: CustomStatus | null
  onSuccess: () => void
}

interface FormValues {
  name: string
  description: string
}

export const StatusForm: React.FC<StatusFormProps> = ({ initialData, onSuccess }) => {
  const createMutation = useCreateCustomStatus()
  const updateMutation = useUpdateCustomStatus()

  // Инициализация формы с начальными данными
  const { values, errors, handleChange, handleSubmit, reset } = useForm<FormValues>({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof FormValues, string>> = {}

      if (!values.name) {
        errors.name = 'Название обязательно'
      }

      if (!values.description) {
        errors.description = 'Описание обязательно'
      }

      return errors
    },
    onSubmit: (values) => {
      if (initialData) {
        // Обновление существующего статуса
        updateMutation.mutate(
          {
            id: initialData.id,
            data: values
          },
          {
            onSuccess: () => {
              notification.success({
                title: 'Успешно',
                description: 'Статус успешно обновлен'
              })
              onSuccess()
            },
            onError: () => {
              notification.error({
                title: 'Ошибка',
                description: 'Не удалось обновить статус'
              })
            }
          }
        )
      } else {
        // Создание нового статуса
        createMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              title: 'Успешно',
              description: 'Статус успешно создан'
            })
            onSuccess()
          },
          onError: () => {
            notification.error({
              title: 'Ошибка',
              description: 'Не удалось создать статус'
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
        name: initialData.name,
        description: initialData.description
      })
    } else {
      reset({
        name: '',
        description: ''
      })
    }
  }, [initialData, reset])

  return (
    <form id="statusForm" onSubmit={handleSubmit} className="space-y-6">
      <Control.Input
        label="Название"
        required
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Control.Textarea
        label="Описание"
        required
        name="description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        rows={4}
      />
    </form>
  )
}
