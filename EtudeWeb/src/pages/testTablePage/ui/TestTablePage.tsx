import React, { useState, useCallback } from 'react'
import { Table, SortState, TableColumn } from '@/widgets/table'
import { Tag } from '@/shared/ui/tag'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Edit, Delete, TableChart } from '@mui/icons-material'
import { useInfiniteQuery } from '@tanstack/react-query'

// Тип для данных
interface Product {
  id: string
  code: string
  name: string
  category: string
  price: number
  stock: number
  manufacturer: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

// Мок-данные для примера (будет использоваться только часть из них на каждой странице)
const allMockProducts: Product[] = Array.from({ length: 100 }, (_, index) => {
  const categories = ['Компьютеры', 'Телефоны', 'Планшеты', 'Мониторы', 'Периферия']
  const manufacturers = ['HP', 'Samsung', 'Apple', 'Dell', 'Logitech', 'Asus', 'LG', 'Acer']

  const randomStock = Math.floor(Math.random() * 50)
  let status: Product['status'] = 'in-stock'

  if (randomStock === 0) {
    status = 'out-of-stock'
  } else if (randomStock < 5) {
    status = 'low-stock'
  }

  return {
    id: `${index + 1}`,
    code: `PRD-${String(index + 1).padStart(3, '0')}`,
    name: `Товар ${index + 1} ${manufacturers[index % manufacturers.length]}`,
    category: categories[index % categories.length],
    price: 1000 + Math.floor(Math.random() * 100000),
    stock: randomStock,
    manufacturer: manufacturers[index % manufacturers.length],
    status: status
  }
})

// Имитация функции API для получения данных с мок-данными и пагинацией
const fetchProducts = async ({
  pageParam = 1,
  pageSize = 10,
  sortField = '',
  sortOrder = null
}: {
  pageParam?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc' | null
}) => {
  // Эмулируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Копируем данные, чтобы не изменять оригинал
  let filteredProducts = [...allMockProducts]

  // Применяем сортировку, если указана
  if (sortField && sortOrder) {
    filteredProducts.sort((a, b) => {
      const valueA = a[sortField as keyof Product]
      const valueB = b[sortField as keyof Product]

      if (valueA === valueB) return 0

      // Сортировка в зависимости от типа данных
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      // Для числовых значений
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
      }

      return 0
    })
  }

  // Вычисляем начальный и конечный индексы для пагинации
  const startIndex = (pageParam - 1) * pageSize
  const endIndex = startIndex + pageSize

  // Получаем срез данных для текущей страницы
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Возвращаем результат в формате, ожидаемом useInfiniteQuery
  return {
    data: paginatedProducts,
    currentPage: pageParam,
    totalPages: Math.ceil(filteredProducts.length / pageSize),
    totalItems: filteredProducts.length,
    hasNextPage: endIndex < filteredProducts.length
  }
}

// Компонент для рендеринга статуса
const StatusBadge: React.FC<{ status: Product['status'] }> = ({ status }) => {
  switch (status) {
    case 'in-stock':
      return <Badge variant="success">В наличии</Badge>
    case 'low-stock':
      return <Badge variant="warning">Мало</Badge>
    case 'out-of-stock':
      return <Badge variant="error">Нет в наличии</Badge>
    default:
      return null
  }
}

// Компонент для рендеринга цены
const PriceCell: React.FC<{ price: number }> = ({ price }) => (
  <div className="font-medium">
    {new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price)}
  </div>
)

const TestTablePage: React.FC = () => {
  // Состояние для сортировки
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null
  })

  // Состояние для переключения между режимами таблицы
  const [scrollable, setScrollable] = useState<boolean>(true)

  // Количество элементов на странице
  const PAGE_SIZE = 10

  // Функция запроса данных для React Query
  const fetchProductsPage = async ({ pageParam = 1 }) => {
    return fetchProducts({
      pageParam,
      pageSize: PAGE_SIZE,
      sortField: sortState.field,
      sortOrder: sortState.direction
    })
  }

  // Использование useInfiniteQuery для запроса с бесконечным скроллом
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['products', sortState],
      queryFn: fetchProductsPage,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined
      },
      initialPageParam: 1
    })

  // Обработчик сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
    // При изменении сортировки перезапрашиваем данные
    refetch()
  }

  // Получаем все продукты из всех загруженных страниц
  const allProducts = data?.pages.flatMap((page) => page.data) || []

  // Обработчики действий
  const handleEdit = (id: string) => {
    console.log(`Редактирование товара с ID: ${id}`)
  }

  const handleDelete = (id: string) => {
    console.log(`Удаление товара с ID: ${id}`)
  }

  // Определение колонок для скроллируемого режима (фиксированные ширины в px)
  const scrollableColumns: TableColumn<Product>[] = [
    {
      id: 'code',
      header: 'Код',
      accessor: 'code',
      sortable: true,
      width: '100px'
    },
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '300px'
    },
    {
      id: 'category',
      header: 'Категория',
      accessor: 'category',
      sortable: true,
      width: '150px',
      render: (item) => <Tag>{item.category}</Tag>
    },
    {
      id: 'price',
      header: 'Цена',
      accessor: 'price',
      sortable: true,
      width: '120px',
      render: (item) => <PriceCell price={item.price} />
    },
    {
      id: 'stock',
      header: 'Запасы',
      accessor: 'stock',
      sortable: true,
      width: '100px'
    },
    {
      id: 'manufacturer',
      header: 'Производитель',
      accessor: 'manufacturer',
      sortable: true,
      width: '150px'
    },
    {
      id: 'status',
      header: 'Статус',
      accessor: 'status',
      sortable: true,
      width: '150px',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      id: 'actions',
      header: 'Действия',
      width: '200px',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="third"
            size="small"
            leftIcon={<Edit />}
            onClick={() => handleEdit(item.id)}
          >
            Изменить
          </Button>
          <Button
            variant="third"
            size="small"
            leftIcon={<Delete />}
            onClick={() => handleDelete(item.id)}
          >
            Удалить
          </Button>
        </div>
      )
    }
  ]

  // Определение колонок для режима растягивающихся колонок (ширины в %)
  const autoWidthColumns: TableColumn<Product>[] = [
    {
      id: 'code',
      header: 'Код',
      accessor: 'code',
      sortable: true,
      width: '10%'
    },
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '25%'
    },
    {
      id: 'category',
      header: 'Категория',
      accessor: 'category',
      sortable: true,
      width: '10%',
      render: (item) => <Tag>{item.category}</Tag>
    },
    {
      id: 'price',
      header: 'Цена',
      accessor: 'price',
      sortable: true,
      width: '10%',
      render: (item) => <PriceCell price={item.price} />
    },
    {
      id: 'stock',
      header: 'Запасы',
      accessor: 'stock',
      sortable: true,
      width: '10%'
    },
    {
      id: 'manufacturer',
      header: 'Производитель',
      accessor: 'manufacturer',
      sortable: true,
      width: '15%'
    },
    {
      id: 'status',
      header: 'Статус',
      accessor: 'status',
      sortable: true,
      width: '10%',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      id: 'actions',
      header: 'Действия',
      width: '10%',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="third"
            size="small"
            leftIcon={<Edit />}
            onClick={() => handleEdit(item.id)}
          >
            Изменить
          </Button>
        </div>
      )
    }
  ]

  // Выбираем колонки в зависимости от режима
  const columns = scrollable ? scrollableColumns : autoWidthColumns

  // Обработчик для загрузки следующей страницы при бесконечном скролле
  const loadMoreData = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-h1 mb-6">Таблица с бесконечным скроллом</h1>

      <div className="mb-6 flex items-center gap-4">
        <span className="text-b3">Режим таблицы:</span>
        <Button
          variant={scrollable ? 'primary' : 'secondary'}
          onClick={() => setScrollable(true)}
          leftIcon={<TableChart />}
        >
          Фиксированная ширина + скролл
        </Button>
        <Button
          variant={!scrollable ? 'primary' : 'secondary'}
          onClick={() => setScrollable(false)}
          leftIcon={<TableChart />}
        >
          Растягивающиеся колонки
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-h2 mb-4">
          {scrollable
            ? 'Режим с фиксированной шириной и бесконечным скроллом'
            : 'Режим с растягивающимися колонками и бесконечным скроллом'}
        </h2>
        <p className="text-b3-regular mb-4 text-mono-700">
          {scrollable
            ? 'Колонки имеют фиксированную ширину в пикселях. При недостатке места появляется горизонтальный скролл. При прокрутке вниз автоматически загружаются новые данные.'
            : 'Колонки растягиваются для заполнения всей ширины контейнера. Ширина колонок задается в процентах. При прокрутке вниз автоматически загружаются новые данные.'}
        </p>

        <div className="w-full border border-mono-300 p-4 rounded mb-8">
          <Table
            data={allProducts}
            columns={columns}
            sortState={sortState}
            onSort={handleSort}
            scrollable={scrollable}
            className="shadow-sm"
            infiniteScroll={true}
            onLoadMore={loadMoreData}
            hasMore={hasNextPage}
            loading={isFetchingNextPage || isLoading}
            threshold={200}
          />
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mt-8">
          <h4 className="font-medium mb-2">Информация о загрузке:</h4>
          <p>Загружено элементов: {allProducts.length}</p>
          <p>Всего элементов в базе: {data?.pages[0].totalItems || 0}</p>
          <p>Есть ли еще данные для загрузки: {hasNextPage ? 'Да' : 'Нет'}</p>
          <p>Идет загрузка: {isFetchingNextPage ? 'Да' : 'Нет'}</p>
        </div>

        <h3 className="text-h2 mt-8 mb-4">Код для использования с React Query</h3>
        <pre className="bg-mono-100 p-4 rounded text-mono-800 overflow-auto text-sm">
          {`// Запрос данных с использованием React Query для бесконечного скролла
let {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  refetch
} = useInfiniteQuery({
  queryKey: ['products', sortState],
  queryFn: ({ pageParam = 1 }) => fetchProducts({
    pageParam,
    pageSize: PAGE_SIZE,
    sortField: sortState.field,
    sortOrder: sortState.direction
  }),
  getNextPageParam: (lastPage) => {
    return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined
  },
  initialPageParam: 1
})

// Получаем все продукты из всех загруженных страниц
const allProducts = data?.pages.flatMap(page => page.data) || []

// Обработчик для загрузки следующей страницы
const loadMoreData = useCallback(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, [hasNextPage, isFetchingNextPage, fetchNextPage])

// Использование компонента Table с бесконечным скроллом
<Table
  data={allProducts}
  columns={columns}
  sortState={sortState}
  onSort={handleSort}
  scrollable={${scrollable}}
  className="shadow-sm"
  infiniteScroll={true}
  onLoadMore={loadMoreData}
  hasMore={!!hasNextPage}
  loading={isFetchingNextPage || isLoading}
  threshold={200}
/>`}
        </pre>

        <div className="mt-12">
          <h2 className="text-h2 mb-4">Особенности использования бесконечного скролла</h2>

          <h3 className="text-b2 mt-8 mb-3">Преимущества бесконечного скролла</h3>
          <ul className="list-disc pl-6 mb-6 text-b3-regular text-mono-700">
            <li>
              Пользователь может просматривать данные без необходимости переключения между
              страницами
            </li>
            <li>Улучшает UX, так как контент загружается автоматически при прокрутке</li>
            <li>Снижает нагрузку на сервер, загружая только необходимые данные</li>
            <li>
              Работает на мобильных устройствах где скролл более естественен, чем переключение
              страниц
            </li>
          </ul>

          <h3 className="text-b2 mt-8 mb-3">Интеграция с серверным API</h3>
          <ul className="list-disc pl-6 mb-6 text-b3-regular text-mono-700">
            <li>
              API должен поддерживать пагинацию с указанием номера страницы и размера страницы
            </li>
            <li>При сортировке необходимо перезагружать данные с первой страницы</li>
            <li>Важно правильно определять, есть ли еще данные для загрузки (hasNextPage)</li>
            <li>React Query автоматически управляет кешированием и повторными запросами</li>
          </ul>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mt-8">
            <h4 className="font-medium mb-2">Важное замечание:</h4>
            <p>
              При работе с большим количеством данных стоит подумать об оптимизации
              производительности. Возможные подходы:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Виртуализация строк (отображение только видимых элементов)</li>
              <li>Очистка неактуальных данных при большом количестве загруженных страниц</li>
              <li>Установка ограничения на максимальное количество загружаемых страниц</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestTablePage
