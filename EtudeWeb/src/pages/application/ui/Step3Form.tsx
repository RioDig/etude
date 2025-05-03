// Обновление Step3Form.tsx с использованием API сотрудников
import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Add, Delete } from '@mui/icons-material'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { useEmployees } from '@/entities/employee'
import { Spinner } from '@/shared/ui/spinner'

interface Step3FormProps {
  onValidChange: (isValid: boolean) => void
}

interface Approver {
  id: string
  userId: string
}

export const Step3Form: React.FC<Step3FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Получаем список уже выбранных участников
  const excludeIds = currentApplication?.participants || []

  // Локальное состояние для списка согласующих
  const [approvers, setApprovers] = useState<Approver[]>(
    currentApplication?.approvers && currentApplication.approvers.length > 0
      ? currentApplication.approvers
      : [{ id: '1', userId: '' }]
  )

  // Получаем список сотрудников из API, исключая уже выбранных участников
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees(excludeIds)

  // Опции для выпадающих списков, исключая уже выбранных согласующих
  const getApproverOptions = (currentApprover: Approver) => {
    if (!employees) return []

    // Исключаем сотрудников, которые уже выбраны как согласующие (кроме текущего)
    const otherApproverIds = approvers
      .filter((a) => a.id !== currentApprover.id)
      .map((a) => a.userId)
      .filter((id) => id !== '') // Только заполненные значения

    return employees
      .filter((emp) => !otherApproverIds.includes(emp.id))
      .map((emp) => ({
        value: emp.id,
        label: emp.name
      }))
  }

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
                options={getApproverOptions(approver)}
                value={approver.userId}
                onChange={(value) => handleApproverChange(approver.id, value)}
                placeholder={isLoadingEmployees ? 'Загрузка...' : 'Выберите сотрудника'}
                disabled={isLoadingEmployees}
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

        {isLoadingEmployees && (
          <div className="mt-2 flex items-center">
            <Spinner size="small" className="mr-2" />
            <span className="text-mono-600 text-b4-regular">Загрузка списка сотрудников...</span>
          </div>
        )}

        {/* Кнопка добавления согласующего */}
        <div className="mt-2">
          <Button
            variant="secondary"
            leftIcon={<Add />}
            onClick={handleAddApprover}
            disabled={
              isLoadingEmployees ||
              // Отключаем, если нет доступных сотрудников для добавления
              (employees && employees.length <= approvers.filter((a) => a.userId !== '').length)
            }
          >
            Добавить сотрудника
          </Button>
        </div>
      </div>
    </div>
  )
}
