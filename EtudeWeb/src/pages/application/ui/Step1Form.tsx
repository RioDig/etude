import React, { useEffect, useState } from 'react'
import { Control } from '@/shared/ui/controls'
import { Typography } from '@/shared/ui/typography'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { CourseType, CourseTrack, CourseFormat } from '@/shared/types'

interface Step1FormProps {
  onValidChange: (isValid: boolean) => void
  isTemplateSelected?: boolean
}

export const Step1Form: React.FC<Step1FormProps> = ({ onValidChange, isTemplateSelected }) => {
  const { currentApplication, updateApplicationData } = useApplicationStore()

  const [name, setName] = useState(currentApplication?.name || '')
  const [type, setType] = useState(currentApplication?.type || '')
  const [track, setTrack] = useState(currentApplication?.track || '')
  const [format, setFormat] = useState(currentApplication?.format || '')
  const [link, setLink] = useState(currentApplication?.link || '')
  const [description, setDescription] = useState(currentApplication?.description || '')
  const [trainingCenter, setTrainingCenter] = useState(currentApplication?.trainingCenter || '')

  const isFieldDisabled = isTemplateSelected

  const typeOptions = [
    { value: CourseType.Course, label: 'Курс' },
    { value: CourseType.Conference, label: 'Конференция' },
    { value: CourseType.Certification, label: 'Сертификация' },
    { value: CourseType.Workshop, label: 'Мастер-класс' }
  ]

  const trackOptions = [
    { value: CourseTrack.HardSkills, label: 'Hard Skills' },
    { value: CourseTrack.SoftSkills, label: 'Soft Skills' },
    { value: CourseTrack.ManagementSkills, label: 'Management Skills' }
  ]

  const formatOptions = [
    { value: CourseFormat.Offline, label: 'Очно' },
    { value: CourseFormat.Online, label: 'Онлайн' }
  ]

  const validateForm = () => {
    const isValid = !!name && !!type && !!track && !!format
    onValidChange(isValid)
    return isValid
  }

  useEffect(() => {
    validateForm()
  }, [name, type, track, format])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    updateApplicationData({ name: e.target.value })
  }

  const handleTypeChange = (value: string) => {
    setType(value as CourseType)
    updateApplicationData({ type: value as CourseType })
  }

  const handleTrackChange = (value: string) => {
    setTrack(value as CourseTrack)
    updateApplicationData({ track: value as CourseTrack })
  }

  const handleFormatChange = (value: string) => {
    setFormat(value as CourseFormat)
    updateApplicationData({ format: value as CourseFormat })
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
    updateApplicationData({ link: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    updateApplicationData({ description: e.target.value })
  }

  const handleTrainingCenterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrainingCenter(e.target.value)
    updateApplicationData({ trainingCenter: e.target.value })
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
        <Control.Input
          label="Наименование"
          required
          value={name}
          onChange={handleNameChange}
          placeholder="Введите наименование"
          disabled={isFieldDisabled}
        />

        <Control.Select
          label="Тип"
          required
          options={typeOptions}
          value={type}
          onChange={handleTypeChange}
          placeholder="Выберите тип курса"
          disabled={isFieldDisabled}
        />

        <Control.Select
          label="Направление"
          required
          options={trackOptions}
          value={track}
          onChange={handleTrackChange}
          placeholder="Выберите направление курса"
          disabled={isFieldDisabled}
        />

        <Control.Select
          label="Формат"
          required
          options={formatOptions}
          value={format}
          onChange={handleFormatChange}
          placeholder="Выберите формат курса"
          disabled={isFieldDisabled}
        />

        <Control.Input
          label="Учебный центр"
          value={trainingCenter}
          onChange={handleTrainingCenterChange}
          placeholder="Введите название учебного центра"
          disabled={isFieldDisabled}
        />

        <Control.Input
          label="Ссылка или место проведения"
          value={link}
          onChange={handleLinkChange}
          placeholder="Введите ссылку или место проведения"
          hint="Укажите ссылку на курс или место проведения"
        />
      </div>

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

export default Step1Form
