import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Add, Delete } from '@mui/icons-material'
import { useApplicationStore } from '@/entities/application/model/applicationStore'

interface Step3FormProps {
  onValidChange: (isValid: boolean) => void
}

interface Approver {
  id: string
  userId: string
}

export const Step3Form: React.FC<Step3FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Локальное состояние для списка согласующих
  const [approvers, setApprovers] = useState<Approver[]>(
    currentApplication?.approvers && currentApplication.approvers.length > 0
      ? currentApplication.approvers
      : [{ id: '1', userId: '' }]
  )

  // Опции для выпадающих списков
  const approverOptions = [
    { value: '1', label: 'Иванов Иван Иванович' },
    { value: '2', label: 'Петров Петр Петрович' },
    { value: '3', label: 'Сидорова Елена Викторовна' },
    { value: '4', label: 'Михайлов Михаил Михайлович' }
  ]

  // Функция валидации формы
  const validateForm = () => {
    const isValid = approvers.length > 0 && approvers.every((approver) => approver.userId !== '')
    onValidChange(isValid)
    return isValid
  }

  // Эффект для валидации при изменении списка согласующих
  useEffect(() => {
    validateForm()
    // Обновляем данные в хранилище при изменении согласующих
    updateApplicationData({ approvers })
  }, [approvers])

  // Добавление нового согласующего
  const handleAddApprover = () => {
    setApprovers([...approvers, { id: Date.now().toString(), userId: '' }])
  }

  // Удаление согласующего
  const handleRemoveApprover = (id: string) => {
    if (approvers.length > 1) {
      setApprovers(approvers.filter((approver) => approver.id !== id))
    }
  }

  // Обновление значения согласующего
  const handleApproverChange = (id: string, value: string) => {
    setApprovers(
      approvers.map((approver) => (approver.id === id ? { ...approver, userId: value } : approver))
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Выберите согласующих для вашего заявления. Необходимо выбрать хотя бы одного согласующего.
      </Typography>

      <div className="flex flex-col gap-4">
        {/* Список согласующих */}
        {approvers.map((approver, index) => (
          <div key={approver.id} className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-mono-200 flex items-center justify-center">
              <Typography variant="b4">{index + 1}</Typography>
            </div>

            <div className="flex-grow">
              <Control.Select
                options={approverOptions}
                value={approver.userId}
                onChange={(value) => handleApproverChange(approver.id, value)}
                placeholder="Выберите сотрудника"
              />
            </div>

            <Button
              variant="third"
              onClick={() => handleRemoveApprover(approver.id)}
              disabled={approvers.length <= 1}
              className="flex-shrink-0"
            >
              <Delete />
            </Button>
          </div>
        ))}

        {/* Кнопка добавления согласующего */}
        <div className="mt-2">
          <Button variant="secondary" leftIcon={<Add />} onClick={handleAddApprover}>
            Добавить сотрудника
          </Button>
        </div>
      </div>
    </div>
  )
}
