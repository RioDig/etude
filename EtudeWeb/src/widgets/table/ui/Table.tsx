import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  // forwardRef,
  useRef,
  useCallback,
  useEffect
} from 'react'
import clsx from 'clsx'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { SortDefaultIcon, SortAscIcon, SortDescIcon } from '@/shared/assets/icons'
import EmptyMessageIcon from '@/shared/assets/images/empty-states/empty.svg'

// Типы для сортировки
export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  field: string
  direction: SortDirection
}

// Типы для колонок
export interface TableColumn<T> {
  id: string
  header?: React.ReactNode
  accessor?: keyof T
  render?: (item: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string // может быть в px (для фиксированных колонок) или процентах % (для растягивающихся)
}

// Контекст для таблицы
interface TableContextType {
  sortState: SortState
  onSort?: (field: string) => void
  scrollable?: boolean
}

const TableContext = createContext<TableContextType>({
  sortState: { field: '', direction: null },
  scrollable: true
})

// Пропсы для таблицы
export interface TableProps<T> {
  /**
   * Данные для отображения (для API на основе пропсов)
   */
  data?: T[]

  /**
   * Конфигурация колонок (для API на основе пропсов)
   */
  columns?: TableColumn<T>[]

  /**
   * Обработчик изменения сортировки (для API на основе пропсов)
   */
  onSort?: (sortState: SortState) => void

  /**
   * Текущее состояние сортировки (для API на основе пропсов)
   */
  sortState?: SortState

  /**
   * Компонент для пустого состояния
   */
  emptyComponent?: React.ReactNode

  /**
   * Разрешить горизонтальный скролл таблицы
   * @default true
   */
  scrollable?: boolean

  /**
   * Использовать бесконечный скролл для загрузки данных
   * @default false
   */
  infiniteScroll?: boolean

  /**
   * Функция для загрузки следующей страницы данных при скролле
   */
  onLoadMore?: () => void

  /**
   * Есть ли еще данные для загрузки
   * @default false
   */
  hasMore?: boolean

  /**
   * Загружаются ли данные в данный момент
   * @default false
   */
  loading?: boolean

  /**
   * Порог загрузки новых данных (в пикселях от нижней границы)
   * @default 200
   */
  threshold?: number

  /**
   * Дочерние элементы для декларативного подхода
   */
  children?: React.ReactNode

  /**
   * CSS классы для контейнера таблицы
   */
  className?: string

  /**
   * CSS классы для хедера таблицы
   */
  headerClassName?: string

  /**
   * CSS классы для строки таблицы
   */
  rowClassName?: string

  /**
   * CSS классы для ячейки таблицы
   */
  cellClassName?: string

  /**
   * ID для тестирования
   */
  testId?: string

  onRowClick?: (item: T, index: number) => void
}

// Пропсы для Header
export interface TableHeaderProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

// Пропсы для HeaderCell
export interface TableHeaderCellProps {
  children?: React.ReactNode
  className?: string
  sortable?: boolean
  sortField?: string
  width?: string // может быть в px (для фиксированных колонок) или процентах % (для растягивающихся)
  testId?: string
}

// Пропсы для Body
export interface TableBodyProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

// Пропсы для Row
export interface TableRowProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

// Пропсы для Cell
export interface TableCellProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

// Компонент индикатора загрузки
const LoadingIndicator = () => (
  <tr>
    <td colSpan={100} className="text-center py-4">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-b4-regular text-mono-800">Загрузка...</span>
      </div>
    </td>
  </tr>
)

/**
 * Компонент таблицы с поддержкой декларативного подхода, API на основе пропсов и бесконечного скролла
 */
export function Table<T>({
  data = [],
  columns = [],
  onSort,
  sortState: externalSortState,
  emptyComponent,
  scrollable = true,
  infiniteScroll = false,
  onLoadMore,
  hasMore = false,
  loading = false,
  threshold = 200,
  children,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  testId = 'table',
  onRowClick
}: TableProps<T>) {
  // Локальное состояние сортировки, если внешнее не предоставлено
  const [localSortState, setLocalSortState] = useState<SortState>({
    field: '',
    direction: null
  })

  // Используем внешнее состояние сортировки, если оно предоставлено, иначе используем локальное
  const currentSortState = externalSortState || localSortState

  // Реф для контейнера таблицы
  const containerRef = useRef<HTMLDivElement>(null)

  // Обработчик нажатия на заголовок для сортировки
  const handleSort = (field: string) => {
    // Определяем новое направление сортировки
    let newDirection: SortDirection = 'asc'

    if (currentSortState.field === field) {
      if (currentSortState.direction === 'asc') {
        newDirection = 'desc'
      } else if (currentSortState.direction === 'desc') {
        newDirection = null
      }
    }

    const newSortState = {
      field,
      direction: newDirection
    }

    // Если предоставлен внешний обработчик, используем его
    if (onSort) {
      onSort(newSortState)
    } else {
      // Иначе обновляем локальное состояние
      setLocalSortState(newSortState)
    }
  }

  // Функция для обработки прокрутки
  const handleScroll = useCallback(() => {
    if (!infiniteScroll || !onLoadMore || !hasMore || loading || !containerRef.current) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const scrollBottom = scrollHeight - scrollTop - clientHeight

    // Если достигли порога загрузки, вызываем onLoadMore
    if (scrollBottom < threshold) {
      onLoadMore()
    }
  }, [infiniteScroll, onLoadMore, hasMore, loading, threshold])

  // Эффект для добавления/удаления обработчика прокрутки
  useEffect(() => {
    const currentContainer = containerRef.current
    if (infiniteScroll && currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll)
      return () => {
        currentContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [infiniteScroll, handleScroll])

  // Значение контекста для обмена состоянием между компонентами
  const contextValue = {
    sortState: currentSortState,
    onSort: handleSort,
    scrollable
  }

  // Проверяем, есть ли колонки с процентной шириной
  // const hasPercentageWidths = useMemo(() => {
  //   return !scrollable && columns.some((column) => column.width && column.width.endsWith('%'))
  // }, [scrollable, columns])

  // Сортировка данных, если используется локальная сортировка и нет декларативных дочерних элементов
  const sortedData = useMemo(() => {
    // Если используется декларативный подход или нет данных для сортировки
    if (children || !data.length) {
      return data
    }

    // Если нет активной сортировки, возвращаем данные как есть
    if (!currentSortState?.direction || !currentSortState?.field) {
      return data
    }

    // Если предоставлен внешний обработчик сортировки, но нет внешнего состояния сортировки,
    // всё равно выполняем сортировку локально
    if (onSort && !externalSortState) {
      return data // Ожидаем, что данные уже будут отсортированы извне
    }

    // Иначе выполняем локальную сортировку
    return [...data].sort((a, b) => {
      const fieldA = a[currentSortState.field as keyof T]
      const fieldB = b[currentSortState.field as keyof T]

      // Если значения равны, не меняем порядок
      if (fieldA === fieldB) {
        return 0
      }

      // Для строк используем localeCompare
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return currentSortState.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA)
      }

      // Для чисел используем обычное сравнение
      return currentSortState.direction === 'asc'
        ? (fieldA as number) - (fieldB as number)
        : (fieldB as number) - (fieldA as number)
    })
  }, [data, currentSortState, onSort, externalSortState, children])

  // Если нет данных и нет декларативных дочерних элементов, показываем пустое состояние
  if (!children && !data.length && !loading) {
    return (
      <div
        className={clsx('rounded-[4px] border border-mono-200 overflow-hidden', className)}
        data-testid={testId}
      >
        {emptyComponent || (
          <EmptyMessage
            variant="small"
            imageUrl={EmptyMessageIcon}
            title="Нет данных"
            description="В таблице нет данных для отображения"
            className="p-8"
          />
        )}
      </div>
    )
  }

  // Рендер на основе API с пропсами
  const renderPropBasedTable = () => {
    // Определяем настройки таблицы в зависимости от режима
    const tableStyles = scrollable
      ? { tableLayout: 'fixed' }
      : { width: '100%', tableLayout: 'auto' }

    const tableClass = scrollable ? 'min-w-full border-collapse' : 'w-full border-collapse'

    const tableContainerClass = clsx(
      scrollable ? 'overflow-x-auto w-full' : 'w-full',
      infiniteScroll && 'max-h-[600px] overflow-y-auto'
    )

    return (
      <div className={tableContainerClass} ref={containerRef}>
        <table
          className={tableClass}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          style={tableStyles}
        >
          {/* Для фиксированных ширин используем colgroup */}
          {scrollable && (
            <colgroup>
              {columns.map((column) => (
                <col
                  key={`col-${column.id}`}
                  style={{
                    width: column.width || 'auto',
                    minWidth: column.width || '150px'
                  }}
                />
              ))}
            </colgroup>
          )}

          <thead>
            <tr
              className={clsx('bg-mono-200 sticky top-0 z-10', headerClassName)}
              data-testid={`${testId}-header`}
            >
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={clsx(
                    'text-left text-b4 font-medium text-mono-800 select-none',
                    'px-6 py-2',
                    column.sortable && 'cursor-pointer hover:bg-mono-300'
                  )}
                  style={
                    scrollable
                      ? {} // ширина определяется через colgroup
                      : { width: column.width || 'auto' }
                  }
                  onClick={() => column.sortable && handleSort(column.id)}
                  data-testid={`${testId}-header-cell-${column.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="truncate mr-2">{column.header}</div>

                    {column.sortable && (
                      <div className="flex-shrink-0">
                        {currentSortState.field === column.id ? (
                          currentSortState.direction === 'asc' ? (
                            <SortAscIcon className="text-mono-900" />
                          ) : currentSortState.direction === 'desc' ? (
                            <SortDescIcon className="text-mono-900" />
                          ) : (
                            <SortDefaultIcon className="text-mono-600" />
                          )
                        ) : (
                          <SortDefaultIcon className="text-mono-600" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={clsx('bg-mono-25 hover:bg-mono-100 transition-colors', rowClassName)}
                data-testid={`${testId}-row-${rowIndex}`}
                onClick={() => onRowClick?.(item, rowIndex)} // Добавить обработчик клика
                style={{ cursor: onRowClick ? 'pointer' : 'auto' }} // Изменить курсор
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.id}`}
                    className={clsx(
                      'text-b4-regular text-mono-950 px-6 py-6 align-top content-center',
                      cellClassName
                    )}
                    data-testid={`${testId}-cell-${rowIndex}-${column.id}`}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : column.accessor
                        ? (item[column.accessor] as React.ReactNode)
                        : null}
                  </td>
                ))}
              </tr>
            ))}
            {loading && <LoadingIndicator />}
          </tbody>
        </table>
      </div>
    )
  }

  // Декларативный вариант таблицы с бесконечным скроллом
  const renderDeclarativeTableWithInfiniteScroll = () => {
    // Вычисляем классы для контейнера таблицы с учетом бесконечного скролла
    const tableContainerClass = clsx(
      scrollable ? 'overflow-x-auto w-full' : 'w-full',
      infiniteScroll && 'max-h-[600px] overflow-y-auto'
    )

    // Адаптируем стили для таблицы
    const tableClass = scrollable ? 'min-w-full border-collapse' : 'w-full border-collapse'

    // Возвращаем таблицу с контейнером, который отслеживает скролл
    return (
      <div className={tableContainerClass} ref={containerRef}>
        <table className={tableClass}>
          {children}
          {loading && (
            <tbody>
              <LoadingIndicator />
            </tbody>
          )}
        </table>
      </div>
    )
  }

  return (
    <div
      className={clsx('rounded-[4px] border border-mono-200 overflow-hidden', className)}
      data-testid={testId}
    >
      <TableContext.Provider value={contextValue}>
        {children ? renderDeclarativeTableWithInfiniteScroll() : renderPropBasedTable()}
      </TableContext.Provider>
    </div>
  )
}

// Компонент Header для декларативного подхода
const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className,
  testId = 'table-header'
}) => {
  return (
    <thead>
      <tr className={clsx('bg-mono-200 sticky top-0 z-10', className)} data-testid={testId}>
        {children}
      </tr>
    </thead>
  )
}

// Компонент HeaderCell для декларативного подхода
const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className,
  sortable = false,
  sortField,
  width,
  testId = 'table-header-cell'
}) => {
  const { sortState, onSort, scrollable } = useContext(TableContext)
  const field = sortField || (typeof children === 'string' ? children : '')

  const handleClick = () => {
    if (sortable && onSort && field) {
      onSort(field)
    }
  }

  // Определяем стили в зависимости от режима таблицы
  const widthStyle = scrollable
    ? {
        width: width || 'auto',
        minWidth: width || '150px'
      }
    : {
        width: width || 'auto'
      }

  return (
    <th
      className={clsx(
        'text-left text-b4 font-medium text-mono-800 select-none',
        'px-6 py-2',
        sortable && 'cursor-pointer hover:bg-mono-300',
        className
      )}
      onClick={sortable ? handleClick : undefined}
      data-testid={testId}
      style={widthStyle}
    >
      <div className="flex items-center justify-between">
        <div className="truncate mr-2">{children}</div>

        {sortable && field && (
          <div className="flex-shrink-0">
            {sortState.field === field ? (
              sortState.direction === 'asc' ? (
                <SortAscIcon className="text-mono-900" />
              ) : sortState.direction === 'desc' ? (
                <SortDescIcon className="text-mono-900" />
              ) : (
                <SortDefaultIcon className="text-mono-600" />
              )
            ) : (
              <SortDefaultIcon className="text-mono-600" />
            )}
          </div>
        )}
      </div>
    </th>
  )
}

// Компонент Body для декларативного подхода
const TableBody: React.FC<TableBodyProps> = ({ children, className, testId = 'table-body' }) => {
  return (
    <tbody className={className} data-testid={testId}>
      {children}
    </tbody>
  )
}

// Компонент Row для декларативного подхода
const TableRow: React.FC<TableRowProps> = ({ children, className, testId = 'table-row' }) => {
  return (
    <tr
      className={clsx('bg-mono-25 hover:bg-mono-100 transition-colors', className)}
      data-testid={testId}
    >
      {children}
    </tr>
  )
}

// Компонент Cell для декларативного подхода
const TableCell: React.FC<TableCellProps> = ({ children, className, testId = 'table-cell' }) => {
  return (
    <td
      className={clsx(
        'text-b4-regular text-mono-950 px-6 py-6 align-top content-center',
        className
      )}
      data-testid={testId}
    >
      {children}
    </td>
  )
}

// Текстовая ячейка
export interface TableTextCellProps {
  value: string | number
  className?: string
  testId?: string
}

export const TableTextCell: React.FC<TableTextCellProps> = ({
  value,
  className,
  testId = 'table-text-cell'
}) => {
  return (
    <div className={clsx('text-b4-regular text-mono-950', className)} data-testid={testId}>
      {value}
    </div>
  )
}

// Декларативный компонент Table с подкомпонентами
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeclarativeTable = Object.assign(Table, {
  Header: TableHeader,
  HeaderCell: TableHeaderCell,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  TextCell: TableTextCell
}) as typeof Table & {
  Header: React.FC<TableHeaderProps>
  HeaderCell: React.FC<TableHeaderCellProps>
  Body: React.FC<TableBodyProps>
  Row: React.FC<TableRowProps>
  Cell: React.FC<TableCellProps>
  TextCell: React.FC<TableTextCellProps>
}

export default DeclarativeTable
