// Обновление Step2Form.tsx с использованием API сотрудников
import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { useEmployees } from '@/entities/employee'
import { Spinner } from '@/shared/ui/spinner'

interface Step2FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step2Form: React.FC<Step2FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Локальные состояния для полей формы
  const [duration, setDuration] = useState<Date | null>(
    currentApplication?.duration ? new Date(currentApplication.duration) : null
  )
  const [goal, setGoal] = useState(currentApplication?.goal || '')
  const [cost, setCost] = useState(currentApplication?.cost || '')
  const [participants, setParticipants] = useState<string[]>(currentApplication?.participants || [])

  // Получаем список сотрудников из API
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees()

  // Опции для мультиселекта сотрудников
  const participantOptions =
    employees?.map((emp) => ({
      value: emp.id,
      label: emp.name
    })) || []

  // Функция валидации формы
  const validateForm = () => {
    const isValid = duration !== null && goal !== '' && cost !== '' && participants.length > 0
    onValidChange(isValid)
    return isValid
  }

  // Эффект для валидации при изменении состояния полей
  useEffect(() => {
    validateForm()
  }, [duration, goal, cost, participants])

  // Обработчик изменения даты
  const handleDateChange = (date: Date | null) => {
    setDuration(date)
    if (date) {
      const formattedDate = date.toISOString().split('T')[0] // Формат YYYY-MM-DD
      updateApplicationData({ duration: formattedDate })
    } else {
      updateApplicationData({ duration: '' })
    }
  }

  // Обработчик изменения цели
  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGoal(e.target.value)
    updateApplicationData({ goal: e.target.value })
  }

  // Обработчик изменения стоимости
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCost(e.target.value)
    updateApplicationData({ cost: e.target.value })
  }

  // Обработчик изменения участников
  const handleParticipantsChange = (values: string[]) => {
    setParticipants(values)
    updateApplicationData({ participants: values })
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Заполните данные о проведении мероприятия. Поля, отмеченные *, обязательны для заполнения
      </Typography>

      <div className="grid grid-cols-1 gap-6">
        {/* Срок прохождения */}
        <Control.DateInput
          label="Срок прохождения"
          required
          value={duration}
          onChange={handleDateChange}
          placeholder="Введите срок прохождения"
        />

        {/* Цель участия */}
        <Control.Textarea
          label="Цель участия"
          required
          value={goal}
          onChange={handleGoalChange}
          placeholder="Введите цель участия"
          rows={3}
        />

        {/* Стоимость участия */}
        <Control.Input
          label="Стоимость участия"
          required
          value={cost}
          onChange={handleCostChange}
          placeholder="Введите стоимость участия"
          hint="Укажите стоимость в рублях"
        />

        {/* Сотрудники */}
        <div>
          <Control.MultiSelect
            label="Сотрудники"
            required
            options={participantOptions}
            value={participants}
            onChange={handleParticipantsChange}
            placeholder={isLoadingEmployees ? 'Загрузка сотрудников...' : 'Выберите сотрудников'}
            hint="Выберите сотрудников, которые будут участвовать в мероприятии"
            disabled={isLoadingEmployees}
          />
          {isLoadingEmployees && (
            <div className="mt-2 flex items-center">
              <Spinner size="small" className="mr-2" />
              <span className="text-mono-600 text-b4-regular">Загрузка списка сотрудников...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
