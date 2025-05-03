import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'

interface Step1FormProps {
  onValidChange: (isValid: boolean) => void
}

export const Step1Form: React.FC<Step1FormProps> = ({ onValidChange }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Опции для выпадающих списков
  const typeOptions = [
    { value: 'conference', label: 'Конференция' },
    { value: 'course', label: 'Курс' },
    { value: 'webinar', label: 'Вебинар' },
    { value: 'training', label: 'Тренинг' }
  ]

  const categoryOptions = [
    { value: 'hard-skills', label: 'Hard Skills' },
    { value: 'soft-skills', label: 'Soft Skills' },
    { value: 'management', label: 'Management' }
  ]

  const formatOptions = [
    { value: 'offline', label: 'Очно' },
    { value: 'online', label: 'Онлайн' },
    { value: 'mixed', label: 'Смешанный' }
  ]

  // Инициализируем начальные значения из хранилища
  const [formState] = useState({
    type: currentApplication?.type || '',
    title: currentApplication?.title || '',
    category: currentApplication?.category || '',
    format: currentApplication?.format || '',
    link: currentApplication?.link || '',
    description: currentApplication?.description || ''
  })

  // Проверка валидации при начальном рендере
  useEffect(() => {
    // Проверяем валидность формы
    const isValid =
      !!formState.type && !!formState.title && !!formState.category && !!formState.format

    // Уведомляем родительский компонент
    onValidChange(isValid)
  }, [formState, onValidChange])

  // Обработчики изменения полей
  const handleTypeChange = (value: string) => {
    updateApplicationData({ type: value })
    validateForm({ ...formState, type: value })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateApplicationData({ title: e.target.value })
    validateForm({ ...formState, title: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    updateApplicationData({ category: value })
    validateForm({ ...formState, category: value })
  }

  const handleFormatChange = (value: string) => {
    updateApplicationData({ format: value })
    validateForm({ ...formState, format: value })
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateApplicationData({ link: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateApplicationData({ description: e.target.value })
  }

  // Функция валидации формы
  const validateForm = (data: typeof formState) => {
    const isValid = !!data.type && !!data.title && !!data.category && !!data.format
    onValidChange(isValid)
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Заполните информацию о мероприятии. Поля, отмеченные *, обязательны для заполнения
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Тип мероприятия */}
        <Control.Select
          label="Тип"
          required
          options={typeOptions}
          value={currentApplication?.type || ''}
          onChange={handleTypeChange}
          placeholder="Выберите тип курса"
        />

        {/* Наименование */}
        <Control.Input
          label="Наименование"
          required
          value={currentApplication?.title || ''}
          onChange={handleTitleChange}
          placeholder="Введите наименование"
        />

        {/* Направление */}
        <Control.Select
          label="Направление"
          required
          options={categoryOptions}
          value={currentApplication?.category || ''}
          onChange={handleCategoryChange}
          placeholder="Выберите направление курса"
        />

        {/* Формат */}
        <Control.Select
          label="Формат"
          required
          options={formatOptions}
          value={currentApplication?.format || ''}
          onChange={handleFormatChange}
          placeholder="Выберите формат курса"
        />

        {/* Ссылка */}
        <Control.Input
          label="Ссылка"
          value={currentApplication?.link || ''}
          onChange={handleLinkChange}
          placeholder="Введите ссылку"
          hint="Укажите ссылку на курс или дополнительную информацию"
        />
      </div>

      {/* Описание */}
      <Control.Textarea
        label="Описание"
        value={currentApplication?.description || ''}
        onChange={handleDescriptionChange}
        placeholder="Введите описание"
        rows={5}
      />
    </div>
  )
}
