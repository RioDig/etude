import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'

interface Step2FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step2Form: React.FC<Step2FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Опции для выпадающих списков (примеры)
  const participantOptions = [
    { value: '1', label: 'Иванов Иван Иванович' },
    { value: '2', label: 'Петров Петр Петрович' },
    { value: '3', label: 'Сидорова Елена Викторовна' },
    { value: '4', label: 'Козлов Алексей Сергеевич' }
  ]

  // Инициализируем начальные значения из хранилища
  const [formState] = useState({
    duration: currentApplication?.duration || '',
    goal: currentApplication?.goal || '',
    cost: currentApplication?.cost || '',
    participants: currentApplication?.participants || []
  })

  // Проверка валидации при начальном рендере
  useEffect(() => {
    // Проверяем валидность формы
    const isValid =
      !!formState.duration &&
      !!formState.goal &&
      !!formState.cost &&
      (formState.participants?.length || 0) > 0

    // Уведомляем родительский компонент
    onValidChange(isValid)
  }, [formState, onValidChange])

  // Обработчик изменения даты
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0] // Формат YYYY-MM-DD
      updateApplicationData({ duration: formattedDate })
      validateForm({ ...formState, duration: formattedDate })
    } else {
      updateApplicationData({ duration: '' })
      validateForm({ ...formState, duration: '' })
    }
  }

  // Обработчик изменения цели
  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateApplicationData({ goal: e.target.value })
    validateForm({ ...formState, goal: e.target.value })
  }

  // Обработчик изменения стоимости
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateApplicationData({ cost: e.target.value })
    validateForm({ ...formState, cost: e.target.value })
  }

  // Обработчик изменения участников
  const handleParticipantsChange = (values: string[]) => {
    updateApplicationData({ participants: values })
    validateForm({ ...formState, participants: values })
  }

  // Функция валидации формы
  const validateForm = (data: typeof formState) => {
    const isValid =
      !!data.duration && !!data.goal && !!data.cost && (data.participants?.length || 0) > 0
    onValidChange(isValid)
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
          value={currentApplication?.duration ? new Date(currentApplication.duration) : null}
          onChange={handleDateChange}
          placeholder="Введите срок прохождения"
        />

        {/* Цель участия */}
        <Control.Textarea
          label="Цель участия"
          required
          value={currentApplication?.goal || ''}
          onChange={handleGoalChange}
          placeholder="Введите цель участия"
          rows={3}
        />

        {/* Стоимость участия */}
        <Control.Input
          label="Стоимость участия"
          required
          value={currentApplication?.cost || ''}
          onChange={handleCostChange}
          placeholder="Введите стоимость участия"
          hint="Укажите стоимость в рублях"
        />

        {/* Сотрудники */}
        <Control.MultiSelect
          label="Сотрудники"
          required
          options={participantOptions}
          value={currentApplication?.participants || []}
          onChange={handleParticipantsChange}
          placeholder="Выберите сотрудников"
          hint="Выберите сотрудников, которые будут участвовать в мероприятии"
        />
      </div>
    </div>
  )
}
