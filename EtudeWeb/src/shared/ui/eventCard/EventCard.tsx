// src/shared/ui/eventCard/EventCard.tsx
import React from 'react'
import clsx from 'clsx'
import { Tag } from '@/shared/ui/tag'
import { Button } from '@/shared/ui/button'
import { AccessTime } from '@mui/icons-material'

export interface EventTag {
  id: string
  label: string
}

export interface EventCardProps {
  /**
   * Уникальный идентификатор мероприятия
   */
  id: string

  /**
   * Теги мероприятия
   */
  tags: EventTag[]

  /**
   * Заголовок мероприятия
   */
  title: string

  /**
   * Описание мероприятия
   */
  description: string

  /**
   * Дата начала мероприятия
   */
  startDate: string | Date

  /**
   * Дата окончания мероприятия
   */
  endDate: string | Date

  /**
   * URL для подробной информации о мероприятии
   */
  detailsUrl?: string

  /**
   * Выбрана ли карточка (для Selected состояния)
   * @default false
   */
  isSelected?: boolean

  /**
   * Обработчик клика по карточке
   */
  onClick?: () => void

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент EventCard - карточка мероприятия для каталога мероприятий
 */
export const EventCard: React.FC<EventCardProps> = ({
  id,
  tags,
  title,
  description,
  startDate,
  endDate,
  detailsUrl,
  isSelected = false,
  onClick,
  className,
  testId = `event-card-${id}`
}) => {
  // Форматирование дат
  const formatDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  // Создаем диапазон дат
  const dateRange = `${formatDate(startDate)} – ${formatDate(endDate)}`

  return (
    <div
      className={clsx(
        'p-6 rounded-lg cursor-pointer transition-colors duration-150',
        'border h-[205px] flex flex-col',
        isSelected
          ? 'border-blue-500 bg-mono-25'
          : 'border-mono-300 bg-mono-25 hover:border-mono-600 hover:bg-mono-50',
        className
      )}
      onClick={onClick}
      data-testid={testId}
    >
      {/* Верхняя часть с тегами */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Tag key={tag.id}>{tag.label}</Tag>
        ))}
      </div>

      {/* Контент */}
      <div className="flex-grow overflow-hidden mb-4">
        {/* Заголовок с обрезанием */}
        <h3 className="text-b2 text-mono-950 mb-2 truncate">{title}</h3>

        {/* Описание с обрезанием на двух строках */}
        <div className="text-b3-regular text-mono-800 max-h-[40px] relative overflow-hidden">
          {/* Стили для обрезания текста на двух строках с многоточием в конце */}
          <p
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Нижняя часть с датой и ссылкой */}
      <div className="flex items-center mt-auto">
        <div className="inline-flex items-center">
          <AccessTime sx={{ width: 20, height: 20 }} className="text-mono-800" />
          <span className="ml-1.5 text-[16px] leading-[20px] text-mono-800">{dateRange}</span>
        </div>

        {detailsUrl && (
          <div className="ml-auto">
            <Button as="link" to={detailsUrl} variant="third" size="small">
              Подробнее
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventCard
