import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarAction } from '@/widgets/sidebar'
import { Control } from '@/shared/ui/controls'
import { CustomStatus, useCreateCustomStatus, useUpdateCustomStatus } from '@/entities/customStatus'
import { notification } from '@/shared/lib/notification'
import { StatusType } from '@/shared/types'

interface StatusSidebarProps {
  open: boolean
  onClose: () => void
  status: CustomStatus | null
}

export const StatusSidebar: React.FC<StatusSidebarProps> = ({ open, onClose, status }) => {
  const [formValues, setFormValues] = useState<Partial<CustomStatus>>({
    name: '',
    description: '',
    type: StatusType.Processed
  })

  const createMutation = useCreateCustomStatus()
  const updateMutation = useUpdateCustomStatus()

  useEffect(() => {
    if (status) {
      setFormValues(status)
    } else {
      setFormValues({
        name: '',
        description: '',
        type: StatusType.Processed
      })
    }
  }, [status, open])

  const handleInputChange = (field: keyof CustomStatus, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const isFormValid = () => {
    return !!(formValues.name && formValues.description)
  }

  const handleSave = () => {
    if (!isFormValid()) {
      notification.error({
        title: 'Ошибка валидации',
        description: 'Пожалуйста, заполните все обязательные поля'
      })
      return
    }

    if (status) {
      updateMutation.mutate(
        {
          id: status.id,
          data: {
            name: formValues.name!,
            description: formValues.description!
          }
        },
        {
          onSuccess: () => {
            notification.success({
              title: 'Успешно',
              description: 'Статус успешно обновлен'
            })
            onClose()
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
      createMutation.mutate(
        {
          name: formValues.name!,
          description: formValues.description!
        },
        {
          onSuccess: () => {
            notification.success({
              title: 'Успешно',
              description: 'Статус успешно создан'
            })
            onClose()
          },
          onError: () => {
            notification.error({
              title: 'Ошибка',
              description: 'Не удалось создать статус'
            })
          }
        }
      )
    }
  }

  const sidebarActions: SidebarAction[] = [
    {
      label: 'Отмена',
      onClick: onClose,
      variant: 'secondary'
    },
    {
      label: status ? 'Сохранить' : 'Создать',
      onClick: handleSave,
      variant: 'primary',
      disabled: !isFormValid() || createMutation.isPending || updateMutation.isPending
    }
  ]

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title={status ? 'Редактирование статуса' : 'Добавление статуса'}
      footerActions={sidebarActions}
    >
      <div className="space-y-6">
        <Control.Input
          label="Название статуса"
          required
          value={formValues.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />

        <Control.Textarea
          label="Описание"
          required
          value={formValues.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </Sidebar>
  )
}
