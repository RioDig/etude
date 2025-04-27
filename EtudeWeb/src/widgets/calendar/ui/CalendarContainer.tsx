// src/widgets/calendar/ui/CalendarContainer.tsx
import React, { useState, useEffect } from 'react'
import { Calendar } from './Calendar'
import { Button } from '@/shared/ui/button'
import { Typography } from '@/shared/ui/typography'
import { Add, CalendarTodayOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Switch } from '@/shared/ui/switch'
import { DatePicker } from '@/shared/ui/datepicker'
import { CalendarCard, CalendarViewMode } from '../model/types'
import { applyFilters, hasActiveFilters } from '../utils/filter-helpers'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'
import { usePageFilters } from '@/entities/filter'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { createPortal } from 'react-dom'

interface CalendarContainerProps {
  /**
   * Массив карточек для отображения в календаре
   */
  cards: CalendarCard[]

  /**
   * Обработчик добавления новой карточки
   */
  onAddCard?: () => void

  /**
   * Обработчик клика по карточке
   */
  onCardClick?: (card: CalendarCard) => void

  /**
   * Начальный режим отображения
   * @default 'month'
   */
  initialViewMode?: CalendarViewMode

  /**
   * Начальная дата для отображения
   * @default new Date()
   */
  initialDate?: Date

  /**
   * Дополнительные классы
   */
  className?: string

  /**
   * ID страницы для сохранения состояния фильтров
   * @default 'calendar'
   */
  pageId?: string

  /**
   * Определение фильтров календаря
   * Если не задано, будут использованы стандартные фильтры
   */
  filterOptions?: FilterOption[]
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  cards,
  onAddCard,
  onCardClick,
  initialViewMode = 'month',
  initialDate = new Date(),
  className,
  pageId = 'calendar',
  filterOptions
}) => {
  // Состояние для отображения легенды статусов
  // const [showLegend, setShowLegend] = useState(true)

  // Получение состояния фильтров из хранилища
  const { filters, resetFilters } = usePageFilters(pageId)

  // Состояние для отфильтрованных карточек
  const [filteredCards, setFilteredCards] = useState<CalendarCard[]>(cards)

  // Используем хук для навигации по календарю
  const {
    viewMode,
    currentDate,
    isDatePickerOpen,
    datePickerAnchor,
    handlePrevPeriod,
    handleNextPeriod,
    handleOpenDatePicker,
    handleDateSelect,
    formatHeaderTitle,
    handleViewModeChange,
    setIsDatePickerOpen
  } = useCalendarNavigation(initialDate, initialViewMode)

  // Определение опций для фильтров, если они не заданы извне
  const defaultFilterOptions: FilterOption[] = [
    {
      id: 'status',
      label: 'Статус',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все статусы' },
        { value: 'pending', label: 'На согласовании' },
        { value: 'approved', label: 'Согласовано' },
        { value: 'rejected', label: 'Отклонено' },
        { value: 'completed', label: 'Пройдено' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'offline', label: 'Очный' },
        { value: 'online', label: 'Дистанционный' },
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
        { value: 'hard-skills', label: 'Hard Skills' },
        { value: 'soft-skills', label: 'Soft Skills' },
        { value: 'management', label: 'Management' }
      ]
    },
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      defaultValue: 'Все',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'course', label: 'Курс' },
        { value: 'conference', label: 'Конференция' },
        { value: 'webinar', label: 'Вебинар' },
        { value: 'training', label: 'Тренинг' }
      ]
    }
  ]

  // Используем или переданные фильтры, или дефолтные
  const activeFilterOptions = filterOptions || defaultFilterOptions

  // Функция фильтрации карточек
  const filterCards = () => {
    // Применяем фильтры к карточкам
    const result = applyFilters(cards, filters)
    setFilteredCards(result)
  }

  // Обработчик изменения фильтров
  const handleFilterChange = () => {
    // filterId: string, value: any
    // Фильтрация будет применена при изменении фильтров через эффект ниже
  }

  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    // Сброс фильтров обрабатывается внутри компонента Filter
    // и обновление filteredCards произойдет через эффект ниже
    resetFilters()
  }

  // Обновляем отфильтрованные карточки при изменении исходных данных или фильтров
  useEffect(() => {
    filterCards()
  }, [cards, filters])

  return (
    <div className={className}>
      {/* Новая структура верхней панели - фильтры слева, контролы справа в одной строке */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-md shadow-sm">
        {/* Левая часть - фильтры */}
        <div className="flex-grow flex flex-wrap items-center">
          <Filter
            filters={activeFilterOptions}
            pageId={pageId}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            className="flex-wrap"
          />
        </div>

        {/* Правая часть - навигация по календарю и переключатель месяц/неделя */}
        <div className="flex-shrink-0 flex items-center gap-4">
          {/* Навигация по календарю */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPeriod}
              className="p-2 hover:bg-mono-100 rounded-full transition-colors"
              aria-label="Предыдущий период"
            >
              <ChevronLeft />
            </button>

            <button
              className="flex items-center gap-1 px-3 py-1 hover:bg-mono-100 rounded-md transition-colors"
              onClick={handleOpenDatePicker}
              aria-label="Выбрать дату"
            >
              <span className="text-b3-semibold">{formatHeaderTitle()}</span>
              <CalendarTodayOutlined fontSize="small" />
            </button>

            <button
              onClick={handleNextPeriod}
              className="p-2 hover:bg-mono-100 rounded-full transition-colors"
              aria-label="Следующий период"
            >
              <ChevronRight />
            </button>

            {/* Портал для DatePicker */}
            {isDatePickerOpen &&
              datePickerAnchor &&
              createPortal(
                <div
                  className="fixed z-50"
                  style={{
                    top: `${datePickerAnchor.getBoundingClientRect().bottom + 8}px`,
                    left: `${datePickerAnchor.getBoundingClientRect().left}px`
                  }}
                >
                  <DatePicker
                    value={currentDate}
                    onChange={handleDateSelect}
                    onClose={() => setIsDatePickerOpen(false)}
                  />
                </div>,
                document.body
              )}
          </div>

          {/* Переключатель режима просмотра месяц/неделя */}
          <Switch
            options={[
              { id: 'week', label: 'Неделя' },
              { id: 'month', label: 'Месяц' }
            ]}
            value={viewMode}
            onChange={handleViewModeChange}
            size="small"
          />

          {/*/!* Кнопка для легенды (можно добавить по необходимости) *!/*/}
          {/*<Button*/}
          {/*  variant="third"*/}
          {/*  size="small"*/}
          {/*  onClick={() => setShowLegend(!showLegend)}*/}
          {/*  className="ml-2"*/}
          {/*>*/}
          {/*  {showLegend ? 'Скрыть легенду' : 'Показать легенду'}*/}
          {/*</Button>*/}

          {/*/!* Кнопка добавления курса *!/*/}
          {/*{onAddCard && (*/}
          {/*  <Button variant="primary" size="small" leftIcon={<Add />} onClick={onAddCard}>*/}
          {/*    Добавить курс*/}
          {/*  </Button>*/}
          {/*)}*/}
        </div>
      </div>

      {/* Легенда статусов */}
      {/*{showLegend && (*/}
      {/*  <div className="flex flex-wrap gap-4 mb-4 p-4 bg-white rounded-md shadow-sm">*/}
      {/*    <Typography variant="b3Semibold" className="mr-2">*/}
      {/*      Статусы:*/}
      {/*    </Typography>*/}

      {/*    {['pending', 'approved', 'rejected', 'completed'].map((status) => (*/}
      {/*      <div key={status} className="flex items-center gap-2">*/}
      {/*        <div*/}
      {/*          className={`w-4 h-4 rounded ${getStatusColor(status as CardStatus).split(' ')[0]} ${getStatusColor(status as CardStatus).split(' ')[1]}`}*/}
      {/*        />*/}
      {/*        <span className="text-b4-regular">{getStatusText(status as CardStatus)}</span>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Дополнительная информация о примененных фильтрах */}
      {hasActiveFilters(filters) && (
        <div className="mb-4 text-right">
          <Typography variant="b4Regular" className="text-mono-600">
            Найдено: {filteredCards.length}{' '}
            {filteredCards.length === 1
              ? 'курс'
              : filteredCards.length >= 2 && filteredCards.length <= 4
                ? 'курса'
                : 'курсов'}
          </Typography>
        </div>
      )}

      {/* Календарь или сообщение о пустом состоянии */}
      {filteredCards.length > 0 ? (
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <Calendar
            cards={filteredCards}
            initialViewMode={viewMode}
            initialDate={currentDate}
            onViewModeChange={handleViewModeChange}
            onDateChange={handleDateSelect}
            onCardClick={onCardClick}
            pageId={pageId}
          />
        </div>
      ) : (
        <div className="bg-white rounded-md p-6 min-h-[400px] flex items-center justify-center">
          <EmptyMessage
            variant="large"
            imageUrl={EmptyStateSvg}
            title="Нет данных для отображения"
            description={
              hasActiveFilters(filters)
                ? 'Измените параметры фильтрации или выберите другой период'
                : 'Нет доступных курсов для отображения'
            }
            actionButton={
              onAddCard && (
                <Button leftIcon={<Add />} onClick={onAddCard}>
                  Добавить курс
                </Button>
              )
            }
          />
        </div>
      )}
    </div>
  )
}

export default CalendarContainer
