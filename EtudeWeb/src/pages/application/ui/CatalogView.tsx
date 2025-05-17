import React, { useEffect, useState } from 'react'
import { EventCard } from '@/shared/ui/eventCard'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { Add } from '@mui/icons-material'
import { Spinner } from '@/shared/ui/spinner'
import { useApplicationCatalog } from '@/entities/application/hooks/useApplicationCatalog'
import { CourseTemplate } from '@/shared/types'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { useQueryClient } from '@tanstack/react-query'
import { FilterValue, usePageFilters } from '@/entities/filter'
import { Control } from '@/shared/ui/controls'
import useDebounce from '@/shared/hooks/useDebounce.ts'

interface CatalogViewProps {
  onSelectTemplate: (template: CourseTemplate) => void
  onCreateCustomEvent: () => void
  selectedTemplateId: string | null
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectTemplate,
  onCreateCustomEvent,
  selectedTemplateId
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { data: templates, isLoading, error } = useApplicationCatalog()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const queryClient = useQueryClient()

  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'Course', label: 'Курс' },
        { value: 'Conference', label: 'Конференция' },
        { value: 'Certification', label: 'Сертификация' },
        { value: 'Workshop', label: 'Мастер-класс' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'Offline', label: 'Очно' },
        { value: 'Online', label: 'Онлайн' }
      ]
    },
    {
      id: 'track',
      label: 'Направление',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все направления' },
        { value: 'Hard Skills', label: 'Hard Skills' },
        { value: 'Soft Skills', label: 'Soft Skills' },
        { value: 'Management Skills', label: 'Management Skills' }
      ]
    }
  ]

  const { setFilter } = usePageFilters('application-catalog')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    setFilter('name', debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const handleFilterChange = (_filterId: string, value: FilterValue) => {
    if (value === '') {
      queryClient.invalidateQueries({ queryKey: ['courseTemplates', 'catalog'] })
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    queryClient.invalidateQueries({ queryKey: ['courseTemplates', 'catalog'] })
  }

  const handleTemplateSelect = (template: CourseTemplate) => {
    onSelectTemplate(template)
  }

  const getReadableType = (type: string): string => {
    const types: Record<string, string> = {
      Course: 'Курс',
      Conference: 'Конференция',
      Certification: 'Сертификация',
      Workshop: 'Мастер-класс'
    }
    return types[type] || type
  }

  const getReadableFormat = (format: string): string => {
    const formats: Record<string, string> = {
      Offline: 'Очно',
      Online: 'Онлайн'
    }
    return formats[format] || format
  }

  const renderFilters = () => (
    <div className="mb-4">
      <Filter
        filters={filterOptions}
        pageId="application-catalog"
        className="flex-wrap"
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />
    </div>
  )

  const renderCatalogContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <Spinner size="medium" className="mr-2" />
          <span className="text-mono-600 text-b4-regular leading-none">
            Загрузка каталога мероприятий...
          </span>
        </div>
      )
    }

    if (error) {
      return (
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
      )
    }

    if (!templates || templates.length === 0) {
      return (
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
      )
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <EventCard
              key={template.course_template_id}
              id={template.course_template_id}
              title={template.course_template_name}
              description={template.course_template_description || ''}
              startDate={template.course_template_startDate || new Date().toISOString()}
              endDate={template.course_template_endDate || new Date().toISOString()}
              tags={[
                { id: '1', label: getReadableType(template.course_template_type) },
                { id: '2', label: getReadableFormat(template.course_template_format) },
                { id: '3', label: template.course_template_track }
              ]}
              isSelected={selectedTemplateId === template.course_template_id}
              onClick={() => handleTemplateSelect(template)}
            />
          ))}
        </div>

        {selectedTemplateId && (
          <div className="mt-4 text-center">
            <Typography variant="b3Regular" className="text-mono-600">
              Нажмите "Далее" для перехода к заполнению заявления
            </Typography>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {renderFilters()}
      <div className="w-full mb-4">
        <Control.Input
          placeholder="Поиск по названию мероприятия..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-auto flex-1">{renderCatalogContent()}</div>
    </div>
  )
}

export default CatalogView
