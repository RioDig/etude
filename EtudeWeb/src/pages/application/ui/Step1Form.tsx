import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'

interface Step1FormProps {
  onValidChange: (isValid: boolean) => void
  isEventSelected?: boolean
}

export const Step1Form: React.FC<Step1FormProps> = ({ onValidChange, isEventSelected }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  // Локальные состояния для полей формы
  const [type, setType] = useState(currentApplication?.type || '')
  const [title, setTitle] = useState(currentApplication?.title || '')
  const [category, setCategory] = useState(currentApplication?.category || '')
  const [format, setFormat] = useState(currentApplication?.format || '')
  const [link, setLink] = useState(currentApplication?.link || '')
  const [description, setDescription] = useState(currentApplication?.description || '')

  // Определяем, можно ли редактировать поля формы
  // Если выбрано мероприятие из каталога - эти поля будут disabled
  const isFieldDisabled = isEventSelected

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

  // Функция валидации формы
  const validateForm = () => {
    const isValid = !!type && !!title && !!category && !!format
    onValidChange(isValid)
    return isValid
  }

  // Эффект для валидации при изменении состояния полей
  useEffect(() => {
    validateForm()
  }, [type, title, category, format])

  // Обработчики изменения полей
  const handleTypeChange = (value: string) => {
    setType(value)
    updateApplicationData({ type: value })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    updateApplicationData({ title: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateApplicationData({ category: value })
  }

  const handleFormatChange = (value: string) => {
    setFormat(value)
    updateApplicationData({ format: value })
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
    updateApplicationData({ link: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    updateApplicationData({ description: e.target.value })
  }

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="b3Regular" className="text-mono-800">
        Заполните информацию о мероприятии. Поля, отмеченные *, обязательны для заполнения
        {isFieldDisabled && (
          <span className="ml-1 text-mono-700">
            (некоторые поля недоступны для редактирования, так как мероприятие выбрано из каталога)
          </span>
        )}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Тип мероприятия */}
        <Control.Select
          label="Тип"
          required
          options={typeOptions}
          value={type}
          onChange={handleTypeChange}
          placeholder="Выберите тип курса"
          disabled={isFieldDisabled}
        />

        {/* Наименование */}
        <Control.Input
          label="Наименование"
          required
          value={title}
          onChange={handleTitleChange}
          placeholder="Введите наименование"
          disabled={isFieldDisabled}
        />

        {/* Направление */}
        <Control.Select
          label="Направление"
          required
          options={categoryOptions}
          value={category}
          onChange={handleCategoryChange}
          placeholder="Выберите направление курса"
          disabled={isFieldDisabled}
        />

        {/* Формат */}
        <Control.Select
          label="Формат"
          required
          options={formatOptions}
          value={format}
          onChange={handleFormatChange}
          placeholder="Выберите формат курса"
          disabled={isFieldDisabled}
        />

        {/* Ссылка */}
        <Control.Input
          label="Ссылка"
          value={link}
          onChange={handleLinkChange}
          placeholder="Введите ссылку"
          hint="Укажите ссылку на курс или дополнительную информацию"
        />
      </div>

      {/* Описание */}
      <Control.Textarea
        label="Описание"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Введите описание"
        rows={5}
        disabled={isFieldDisabled}
      />
    </div>
  )
}
