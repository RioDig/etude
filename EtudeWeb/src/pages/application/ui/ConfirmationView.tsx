// Обновим ConfirmationView.tsx, добавив логику отправки:
import React from 'react'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Edit } from '@mui/icons-material'
import { useApplicationStore } from '@/entities/application/model/applicationStore'
import { Tag } from '@/shared/ui/tag'
// import { useApplicationSubmit } from '@/entities/application'
// import { Spinner } from '@/shared/ui/spinner'
// import { notification } from '@/shared/lib/notification'
// import { useNavigate } from 'react-router-dom'

interface SectionProps {
  title: string
  onEdit: () => void
  children: React.ReactNode
}

// Компонент секции данных с возможностью редактирования
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

// Компонент строки данных
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
  // const navigate = useNavigate()

  // Хук для отправки заявления
  // const { mutate: submitApplication, isPending } = useApplicationSubmit()

  // Обработчик отправки заявления
  // const handleSubmit = () => {
  //   if (!currentApplication) return
  //
  //   // Отправляем заявление на сервер
  //   submitApplication(currentApplication, {
  //     onSuccess: () => {
  //       // Показываем уведомление об успехе
  //       notification.success({
  //         title: 'Заявление отправлено',
  //         description: 'Ваше заявление успешно отправлено и находится на рассмотрении'
  //       })
  //
  //       // Перенаправляем на страницу заявлений
  //       navigate('/applications')
  //     },
  //     onError: () => {
  //       // Показываем уведомление об ошибке
  //       notification.error({
  //         title: 'Ошибка отправки',
  //         description: 'Не удалось отправить заявление. Пожалуйста, попробуйте позже.'
  //       })
  //     }
  //   })
  // }

  // Форматирование типа мероприятия
  const getEventType = () => {
    switch (currentApplication?.type) {
      case 'conference':
        return 'Конференция'
      case 'course':
        return 'Курс'
      case 'webinar':
        return 'Вебинар'
      case 'training':
        return 'Тренинг'
      default:
        return currentApplication?.type || ''
    }
  }

  // Форматирование категории
  const getCategory = () => {
    switch (currentApplication?.category) {
      case 'hard-skills':
        return 'Hard Skills'
      case 'soft-skills':
        return 'Soft Skills'
      case 'management':
        return 'Management'
      default:
        return currentApplication?.category || ''
    }
  }

  // Форматирование формата
  const getFormat = () => {
    switch (currentApplication?.format) {
      case 'offline':
        return 'Очно'
      case 'online':
        return 'Онлайн'
      case 'mixed':
        return 'Смешанный'
      default:
        return currentApplication?.format || ''
    }
  }

  // Форматирование участников
  const getParticipants = () => {
    if (!currentApplication?.participants || currentApplication.participants.length === 0) {
      return 'Не выбраны'
    }

    // В реальном проекте здесь был бы запрос на получение данных пользователей
    // Сейчас используем моковые данные
    const participantMap: Record<string, string> = {
      '1': 'Иванов Иван Иванович',
      '2': 'Петров Петр Петрович',
      '3': 'Сидорова Елена Викторовна',
      '4': 'Козлов Алексей Сергеевич'
    }

    return (
      <div className="flex flex-col gap-2">
        {currentApplication.participants.map((id) => (
          <div key={id}>{participantMap[id] || id}</div>
        ))}
      </div>
    )
  }

  // Форматирование согласующих
  const getApprovers = () => {
    if (!currentApplication?.approvers || currentApplication.approvers.length === 0) {
      return 'Не выбраны'
    }

    // Аналогично, в реальном проекте здесь был бы запрос на получение данных пользователей
    const approverMap: Record<string, string> = {
      '1': 'Иванов Иван Иванович (Руководитель группы дизайна)',
      '2': 'Петров Петр Петрович (Руководитель отдела разработки)',
      '3': 'Сидорова Елена Викторовна (Руководитель HR)',
      '4': 'Михайлов Михаил Михайлович (Технический директор)'
    }

    return (
      <div className="flex flex-col gap-2">
        {currentApplication.approvers.map((approver) => (
          <div key={approver.id}>{approverMap[approver.userId] || approver.userId}</div>
        ))}
      </div>
    )
  }

  // Теги для отображения типа, категории и формата
  const eventTags = (
    <div className="flex flex-wrap gap-2">
      <Tag>{getEventType()}</Tag>
      <Tag>{getCategory()}</Tag>
      <Tag>{getFormat()}</Tag>
    </div>
  )

  // Если нет данных заявления
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
      {/* Секция о мероприятии */}
      <Section title="О мероприятии" onEdit={() => setActiveStep(0)}>
        <DataRow label="Тип" value={getEventType()} />
        <DataRow label="Наименование" value={currentApplication.title || ''} />
        <DataRow label="Направление" value={getCategory()} />
        <DataRow label="Формат" value={getFormat()} />
        <DataRow label="Ссылка" value={currentApplication.link || 'Не указана'} />

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

      {/* Секция о проведении */}
      <Section title="Данные о проведении" onEdit={() => setActiveStep(1)}>
        <DataRow
          label="Срок прохождения"
          value={
            currentApplication.duration
              ? new Date(currentApplication.duration).toLocaleDateString('ru-RU')
              : 'Не указан'
          }
        />
        <DataRow label="Цель участия" value={currentApplication.goal || 'Не указана'} />
        <DataRow
          label="Стоимость участия"
          value={currentApplication.cost ? `${currentApplication.cost} рублей` : 'Не указана'}
        />
        <DataRow label="Сотрудники" value={getParticipants()} />
      </Section>

      {/* Секция согласующих */}
      <Section title="Согласующие" onEdit={() => setActiveStep(2)}>
        {getApprovers()}
      </Section>

      {/* Кнопка отправки заявления */}
      {/*<div className="mt-4 flex justify-center">*/}
      {/*  <Button variant="primary" size="large" onClick={handleSubmit} disabled={isPending}>*/}
      {/*    {isPending ? (*/}
      {/*      <>*/}
      {/*        <Spinner size="small" variant="white" className="mr-2" />*/}
      {/*        <span>Отправка заявления...</span>*/}
      {/*      </>*/}
      {/*    ) : (*/}
      {/*      'Подтвердить и отправить'*/}
      {/*    )}*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  )
}

export default ConfirmationView
