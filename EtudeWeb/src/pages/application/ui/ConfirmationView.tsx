import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Edit } from '@mui/icons-material'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { Tag } from '@/shared/ui/tag'
import { CourseType, CourseTrack, CourseFormat } from '@/shared/types'

interface SectionProps {
  title: string
  onEdit: () => void
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ title, onEdit, children }) => {
  return (
    <div className="border-b border-mono-200 pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h2Regular">{title}</Typography>
        <Button variant="third" leftIcon={<Edit />} onClick={onEdit}>
          Редактировать
        </Button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

const DataRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({
  label,
  value
}) => {
  return (
    <div className="flex">
      <Typography variant="b3Regular" className="text-mono-700 w-[200px] shrink-0">
        {label}:
      </Typography>
      <Typography variant="b3Regular" className="text-mono-950">
        {value}
      </Typography>
    </div>
  )
}

export const ConfirmationView: React.FC = () => {
  const { currentApplication, setActiveStep } = useApplicationStore()

  const getEventType = () => {
    const types: Record<string, string> = {
      [CourseType.Course]: 'Курс',
      [CourseType.Conference]: 'Конференция',
      [CourseType.Certification]: 'Сертификация',
      [CourseType.Workshop]: 'Мастер-класс'
    }
    return types[currentApplication?.type as string] || currentApplication?.type || ''
  }

  const getTrack = () => {
    const tracks: Record<string, string> = {
      [CourseTrack.HardSkills]: 'Hard Skills',
      [CourseTrack.SoftSkills]: 'Soft Skills',
      [CourseTrack.ManagementSkills]: 'Management Skills'
    }
    return tracks[currentApplication?.track as string] || currentApplication?.track || ''
  }

  const getFormat = () => {
    const formats: Record<string, string> = {
      [CourseFormat.Offline]: 'Очно',
      [CourseFormat.Online]: 'Онлайн'
    }
    return formats[currentApplication?.format as string] || currentApplication?.format || ''
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указана'
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const getApprovers = () => {
    if (!currentApplication?.approvers || currentApplication.approvers.length === 0) {
      return 'Не выбраны'
    }

    return (
      <div className="flex flex-col gap-2">
        {currentApplication.approvers.map((approver) => (
          <div key={approver.id}>
            {approver.employeeData
              ? `${approver.employeeData.surname} ${approver.employeeData.name}${approver.employeeData.patronymic ? ` ${approver.employeeData.patronymic}` : ''}${approver.employeeData.position ? ` (${approver.employeeData.position})` : ''}`
              : approver.user_id}
          </div>
        ))}
      </div>
    )
  }

  const eventTags = (
    <div className="flex flex-wrap gap-2">
      <Tag>{getEventType()}</Tag>
      <Tag>{getTrack()}</Tag>
      <Tag>{getFormat()}</Tag>
    </div>
  )

  if (!currentApplication) {
    return (
      <div className="text-center py-6">
        <Typography variant="b3Regular" className="text-mono-700">
          Нет данных для отображения. Пожалуйста, заполните форму заявления.
        </Typography>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Section title="О мероприятии" onEdit={() => setActiveStep(0)}>
        <DataRow label="Наименование" value={currentApplication.name || ''} />
        <DataRow label="Тип" value={getEventType()} />
        <DataRow label="Направление" value={getTrack()} />
        <DataRow label="Формат" value={getFormat()} />
        <DataRow label="Учебный центр" value={currentApplication.trainingCenter || 'Не указан'} />
        <DataRow
          label="Ссылка или место проведения"
          value={currentApplication.link || 'Не указана'}
        />

        <div className="mt-2">
          <Typography variant="b3Regular" className="text-mono-700 mb-2">
            Описание:
          </Typography>
          <Typography variant="b3Regular" className="text-mono-950 whitespace-pre-wrap">
            {currentApplication.description || 'Описание не указано'}
          </Typography>
        </div>

        <div className="mt-2">
          <Typography variant="b3Regular" className="text-mono-700 mb-2">
            Теги:
          </Typography>
          {eventTags}
        </div>
      </Section>

      <Section title="Данные о проведении" onEdit={() => setActiveStep(1)}>
        <DataRow label="Дата начала" value={formatDate(currentApplication.startDate)} />
        <DataRow label="Дата окончания" value={formatDate(currentApplication.endDate)} />
        <DataRow label="Цель участия" value={currentApplication.educationGoal || 'Не указана'} />
        <DataRow
          label="Стоимость участия"
          value={currentApplication.price ? `${currentApplication.price} рублей` : 'Не указана'}
        />
      </Section>

      <Section title="Согласующие" onEdit={() => setActiveStep(2)}>
        {getApprovers()}
      </Section>
    </div>
  )
}

export default ConfirmationView
