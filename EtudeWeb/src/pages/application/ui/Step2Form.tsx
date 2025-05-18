import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { useAuth } from '@/entities/session'
import { formatDate } from '@/shared/utils/formatDate.ts'

interface Step2FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step2Form: React.FC<Step2FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()
  const { user } = useAuth()

  const [startDate, setStartDate] = useState<Date | null>(
    currentApplication?.startDate ? new Date(currentApplication.startDate) : null
  )
  const [endDate, setEndDate] = useState<Date | null>(
    currentApplication?.endDate ? new Date(currentApplication.endDate) : null
  )
  const [educationGoal, setEducationGoal] = useState(currentApplication?.educationGoal || '')
  const [price, setPrice] = useState(currentApplication?.price || '')

  useEffect(() => {
    if (user) {
      updateApplicationData({ learner_id: user.id })
    }
  }, [user, updateApplicationData])

  const validateForm = () => {
    const isValid = !!startDate && !!endDate && !!educationGoal && !!price && !!user
    onValidChange(isValid)
    return isValid
  }

  useEffect(() => {
    validateForm()
  }, [startDate, endDate, educationGoal, price, user])

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    if (date) {
      updateApplicationData({ startDate: formatDate(date) })
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
    if (date) {
      updateApplicationData({ endDate: formatDate(date) })
    }
  }

  const handleEducationGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEducationGoal(e.target.value)
    updateApplicationData({ educationGoal: e.target.value })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
    updateApplicationData({ price: e.target.value })
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Заполните данные о проведении мероприятия. Поля, отмеченные *, обязательны для заполнения.
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Control.DateInput
          label="Дата начала"
          required
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Выберите дату начала"
        />

        <Control.DateInput
          label="Дата окончания"
          required
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="Выберите дату окончания"
        />

        <div className="md:col-span-2">
          <Control.Textarea
            label="Цель участия"
            required
            value={educationGoal}
            onChange={handleEducationGoalChange}
            placeholder="Введите цель участия"
            rows={3}
          />
        </div>

        <Control.Input
          label="Стоимость участия"
          required
          value={price}
          onChange={handlePriceChange}
          placeholder="Введите стоимость участия"
          hint="Укажите стоимость в рублях"
        />
      </div>

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
  )
}

export default Step2Form
