// Обновляем Step2Form.tsx - убираем выбор сотрудников
import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { useAuth } from '@/entities/session'

interface Step2FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step2Form: React.FC<Step2FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()
  const { user } = useAuth() // Получаем текущего пользователя из контекста аутентификации

  // Локальные состояния для полей формы
  const [duration, setDuration] = useState<Date | null>(
    currentApplication?.duration ? new Date(currentApplication.duration) : null
  )
  const [goal, setGoal] = useState(currentApplication?.goal || '')
  const [cost, setCost] = useState(currentApplication?.cost || '')

  // Эффект для автоматического добавления текущего пользователя в список участников
  useEffect(() => {
    if (user) {
      // Устанавливаем текущего пользователя как единственного участника
      updateApplicationData({ participants: [user.id] })
    }
  }, [user, updateApplicationData])

  // Функция валидации формы
  const validateForm = () => {
    const isValid = duration !== null && goal !== '' && cost !== '' && !!user
    onValidChange(isValid)
    return isValid
  }

  // Эффект для валидации при изменении состояния полей
  useEffect(() => {
    validateForm()
  }, [duration, goal, cost, user])

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

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Заполните данные о проведении мероприятия. Поля, отмеченные *, обязательны для заполнения.
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

        {/* Информация об участнике */}
        {user && (
          <div className="bg-mono-100 p-4 rounded-md">
            <Typography variant="b3Semibold" className="mb-2">
              Участник:
            </Typography>
            <Typography variant="b3Regular">
              {user.surname} {user.name}
              {user.position && `, ${user.position}`}
              {user.department && ` (${user.department})`}
            </Typography>
          </div>
        )}
      </div>
    </div>
  )
}
