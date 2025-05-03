import React from 'react'
import { EventCard } from '@/shared/ui/eventCard'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { Add } from '@mui/icons-material'
import { Spinner } from '@/shared/ui/spinner'
import { useApplicationCatalog } from '@/entities/application/hooks/useApplicationCatalog'
import { ApplicationEvent } from '@/entities/application/model/applicationStore'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import {
  EVENT_TYPES,
  EVENT_CATEGORIES,
  EVENT_FORMATS
} from '@/entities/application/model/constants'

interface CatalogViewProps {
  onSelectEvent: (event: ApplicationEvent) => void
  onCreateCustomEvent: () => void
  selectedEventId: string | null
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectEvent,
  onCreateCustomEvent,
  selectedEventId
}) => {
  // Получение данных каталога мероприятий
  const { data: events, isLoading, error } = useApplicationCatalog()

  // Опции для фильтров
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'conference', label: 'Конференция' },
        { value: 'course', label: 'Курс' },
        { value: 'webinar', label: 'Вебинар' },
        { value: 'training', label: 'Тренинг' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'offline', label: 'Очно' },
        { value: 'online', label: 'Онлайн' },
        { value: 'mixed', label: 'Смешанный' }
      ]
    },
    {
      id: 'category',
      label: 'Категория',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все категории' },
        { value: 'hard-skills', label: 'Hard skills' },
        { value: 'soft-skills', label: 'Soft skills' },
        { value: 'management', label: 'Management' }
      ]
    }
  ]

  // Обработчик выбора события
  const handleEventSelect = (event: ApplicationEvent) => {
    onSelectEvent(event)
  }

  // Получение читаемого названия для типа мероприятия
  const getReadableType = (type: string): string => {
    return EVENT_TYPES[type as keyof typeof EVENT_TYPES] || type
  }

  // Получение читаемого названия для категории
  const getReadableCategory = (category: string): string => {
    return EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || category
  }

  // Получение читаемого названия для формата
  const getReadableFormat = (format: string): string => {
    return EVENT_FORMATS[format as keyof typeof EVENT_FORMATS] || format
  }

  // Отображаем фильтры всегда, даже при загрузке
  const renderFilters = () => (
    <div className="mb-4">
      <Filter filters={filterOptions} pageId="application-catalog" className="flex-wrap" />
    </div>
  )

  // Показываем загрузку, но оставляем фильтры
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {renderFilters()}
        <div className="flex justify-center items-center h-[400px]">
          <Spinner size="large" label="Загрузка каталога мероприятий..." />
        </div>
      </div>
    )
  }

  // Показываем сообщение об ошибке, но оставляем фильтры
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        {renderFilters()}
        <EmptyMessage
          variant="large"
          imageUrl={EmptyStateSvg}
          title="Ошибка загрузки каталога"
          description="Не удалось загрузить список мероприятий. Пожалуйста, попробуйте позже или создайте свое мероприятие."
          actionButton={
            <Button leftIcon={<Add />} onClick={onCreateCustomEvent}>
              Предложить свое мероприятие
            </Button>
          }
        />
      </div>
    )
  }

  // Если нет мероприятий
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {renderFilters()}
        <EmptyMessage
          variant="large"
          imageUrl={EmptyStateSvg}
          title="В каталоге пока нет мероприятий"
          description="Вы можете предложить свое мероприятие для проведения"
          actionButton={
            <Button leftIcon={<Add />} onClick={onCreateCustomEvent}>
              Предложить свое мероприятие
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Фильтры */}
      {renderFilters()}

      {/* Результаты поиска - сетка с карточками мероприятий */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description || ''}
            startDate={event.startDate}
            endDate={event.endDate}
            tags={[
              { id: '1', label: getReadableType(event.type) },
              { id: '2', label: getReadableFormat(event.format) },
              { id: '3', label: getReadableCategory(event.category) }
            ]}
            isSelected={selectedEventId === event.id}
            onClick={() => handleEventSelect(event)}
          />
        ))}
      </div>

      {/* Информационная подсказка при выборе мероприятия */}
      {selectedEventId && (
        <div className="mt-4 text-center">
          <Typography variant="b3Regular" className="text-mono-600">
            Нажмите "Далее" для перехода к заполнению заявления
          </Typography>
        </div>
      )}
    </div>
  )
}

export default CatalogView
