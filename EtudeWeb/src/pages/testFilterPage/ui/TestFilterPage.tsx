import React, { useMemo, useCallback } from 'react'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Add } from '@mui/icons-material'
import { usePageFilters } from '@/entities/filter'
import { Typography } from '@/shared/ui/typography'

// Тестовые данные
const mockData = [
  {
    id: '1',
    name: 'Проект А',
    status: 'active',
    category: 'development',
    date: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Проект Б',
    status: 'completed',
    category: 'design',
    date: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Проект В',
    status: 'paused',
    category: 'development',
    date: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Проект Г',
    status: 'active',
    category: 'marketing',
    date: new Date('2023-04-05')
  },
  {
    id: '5',
    name: 'Проект Д',
    status: 'completed',
    category: 'design',
    date: new Date('2023-05-12')
  },
  {
    id: '6',
    name: 'Проект Е',
    status: 'active',
    category: 'development',
    date: new Date('2025-04-04')
  }
]

// ID страницы для хранения фильтров
const PAGE_ID = 'test-filter-page'

// Опции для фильтров - вынесены за пределы компонента
const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'status',
    label: 'Статус',
    type: 'dropdown',
    defaultValue: 'Все',
    options: [
      { value: '', label: 'Все' },
      { value: 'active', label: 'Активный' },
      { value: 'paused', label: 'Приостановлен' },
      { value: 'completed', label: 'Завершен' }
    ]
  },
  {
    id: 'category',
    label: 'Категория',
    type: 'dropdown',
    defaultValue: 'Все',
    options: [
      { value: '', label: 'Все' },
      {
        value: 'development',
        label: 'Разработкаfgjhkjkhfgkhjfgjkh hkkjgf kjkhgf hkjkj fghkkjfg hkj'
      },
      { value: 'design', label: 'Дизайн' },
      { value: 'marketing', label: 'Маркетинг' }
    ]
  },
  {
    id: 'date',
    label: 'Дата',
    type: 'date',
    defaultValue: 'Все даты'
  }
]

// Компонент для примера использования фильтров
const TestFilterPage: React.FC = () => {
  console.log('TestFilterPage render')

  // Получаем состояние фильтров и функции для управления
  const {
    filters,
    // setFilter,
    // resetFilters
  } = usePageFilters(PAGE_ID)

  // Вычисляем отфильтрованные данные напрямую при рендере
  const filteredData = useMemo(() => {
    let result = [...mockData]

    // Применяем фильтр по статусу, если он выбран
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status)
    }

    // Применяем фильтр по категории, если он выбран
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category)
    }

    // Применяем фильтр по дате, если она выбрана
    if (filters.date instanceof Date) {
      result = result.filter((item) => {
        // Сравниваем только даты без времени
        const filterDate = new Date(filters.date as Date)
        const itemDate = new Date(item.date)

        return (
          filterDate.getFullYear() === itemDate.getFullYear() &&
          filterDate.getMonth() === itemDate.getMonth() &&
          filterDate.getDate() === itemDate.getDate()
        )
      })
    }

    return result
  }, [filters])

  // Обработчик изменения фильтра (не обязателен, но может быть полезен для логирования)
  const handleFilterChange = useCallback((filterId: string, value: unknown) => {
    console.log(`Фильтр ${filterId} изменен на:`, value)
  }, [])

  // Обработчик сброса фильтров
  const handleResetFilters = useCallback(() => {
    console.log('Фильтры сброшены')
  }, [])

  // Получение цвета бейджа в зависимости от статуса
  const getStatusBadgeVariant = useCallback(
    (status: string): 'default' | 'success' | 'warning' | 'error' => {
      switch (status) {
        case 'active':
          return 'success'
        case 'paused':
          return 'warning'
        case 'completed':
          return 'default'
        default:
          return 'default'
      }
    },
    []
  )

  // Получение названия статуса на русском
  const getStatusName = useCallback((status: string): string => {
    switch (status) {
      case 'active':
        return 'Активный'
      case 'paused':
        return 'Приостановлен'
      case 'completed':
        return 'Завершен'
      default:
        return status
    }
  }, [])

  // Получение названия категории на русском
  const getCategoryName = useCallback((category: string): string => {
    switch (category) {
      case 'development':
        return 'Разработка'
      case 'design':
        return 'Дизайн'
      case 'marketing':
        return 'Маркетинг'
      default:
        return category
    }
  }, [])

  return (
    <div className="p-6">
      <Typography variant="h1" className="mb-6">
        Проекты
      </Typography>

      {/* Верхняя панель с фильтрами и кнопкой добавления */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Filter
            filters={FILTER_OPTIONS}
            pageId={PAGE_ID}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <Button variant="primary" leftIcon={<Add />}>
          Добавить проект
        </Button>
      </div>

      {/* Счетчик результатов */}
      <div className="mb-4 text-b3-regular text-mono-700">
        Найдено: {filteredData.length} проектов
      </div>

      {/* Таблица с результатами */}
      <div className="bg-white rounded-md shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-mono-300">
              <th className="px-4 py-3 text-left text-b3-semibold text-mono-900">Название</th>
              <th className="px-4 py-3 text-left text-b3-semibold text-mono-900">Статус</th>
              <th className="px-4 py-3 text-left text-b3-semibold text-mono-900">Категория</th>
              <th className="px-4 py-3 text-left text-b3-semibold text-mono-900">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-mono-200 hover:bg-mono-100">
                  <td className="px-4 py-3 text-b3-regular text-mono-900">{item.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {getStatusName(item.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-b3-regular text-mono-900">
                    {getCategoryName(item.category)}
                  </td>
                  <td className="px-4 py-3 text-b3-regular text-mono-700">
                    {item.date.toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-b3-regular text-mono-700">
                  Проекты не найдены. Попробуйте изменить параметры фильтрации.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TestFilterPage
