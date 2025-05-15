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
  accessor?: keyof T | string
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

export interface TableHeaderProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

export interface TableHeaderCellProps {
  children?: React.ReactNode
  className?: string
  sortable?: boolean
  sortField?: string
  width?: string
  testId?: string
}

export interface TableBodyProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

export interface TableRowProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

export interface TableCellProps {
  children?: React.ReactNode
  className?: string
  testId?: string
}

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
  const [localSortState, setLocalSortState] = useState<SortState>({
    field: '',
    direction: null
  })

  const currentSortState = externalSortState || localSortState

  const containerRef = useRef<HTMLDivElement>(null)

  const handleSort = (field: string) => {
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

    if (onSort) {
      onSort(newSortState)
    } else {
      setLocalSortState(newSortState)
    }
  }

  // @ts-expect-error Any fix
  const getValueByPath = (obj, path: string) => {
    return path.split('.').reduce((p, c) => (p && p[c] !== undefined ? p[c] : null), obj)
  }

  const handleScroll = useCallback(() => {
    if (!infiniteScroll || !onLoadMore || !hasMore || loading || !containerRef.current) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const scrollBottom = scrollHeight - scrollTop - clientHeight

    if (scrollBottom < threshold) {
      onLoadMore()
    }
  }, [infiniteScroll, onLoadMore, hasMore, loading, threshold])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (infiniteScroll && currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll)
      return () => {
        currentContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [infiniteScroll, handleScroll])

  const contextValue = {
    sortState: currentSortState,
    onSort: handleSort,
    scrollable
  }

  const sortedData = useMemo(() => {
    if (children || !data.length) {
      return data
    }

    if (!currentSortState?.direction || !currentSortState?.field) {
      return data
    }

    if (onSort && !externalSortState) {
      return data
    }

    return [...data].sort((a, b) => {
      const fieldPath = currentSortState.field
      let fieldA, fieldB

      if (fieldPath.includes('.')) {
        fieldA = getValueByPath(a, fieldPath)
        fieldB = getValueByPath(b, fieldPath)
      } else {
        fieldA = a[fieldPath as keyof T]
        fieldB = b[fieldPath as keyof T]
      }

      if (fieldA === fieldB) {
        return 0
      }

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return currentSortState.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA)
      }

      return currentSortState.direction === 'asc'
        ? (fieldA as number) - (fieldB as number)
        : (fieldB as number) - (fieldA as number)
    })
  }, [data, currentSortState, onSort, externalSortState, children])

  if (!children && !data.length && !loading) {
    return (
      <div
        className={clsx(
          'rounded-[4px] border border-mono-200 overflow-hidden flex-col flex h-full',
          className
        )}
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

  const renderPropBasedTable = () => {
    const tableStyles = scrollable
      ? { tableLayout: 'fixed' }
      : { width: '100%', tableLayout: 'auto' }

    const tableClass = scrollable ? 'min-w-full border-collapse' : 'w-full border-collapse'

    const tableContainerClass = clsx(
      scrollable ? 'overflow-x-auto w-full' : 'w-full',
      infiniteScroll && 'max-h-[750px] overflow-y-auto'
    )

    return (
      <div className={tableContainerClass} ref={containerRef}>
        <table
          className={tableClass}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          style={tableStyles}
        >
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
                onClick={() => onRowClick?.(item, rowIndex)}
                style={{ cursor: onRowClick ? 'pointer' : 'auto' }}
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
                        ? typeof column.accessor === 'string' &&
                          String(column.accessor).includes('.')
                          ? getValueByPath(item, String(column.accessor))
                          // @ts-expect-error Any fix
                          : (item[column.accessor] as React.ReactNode)
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

  const renderDeclarativeTableWithInfiniteScroll = () => {
    const tableContainerClass = clsx(
      scrollable ? 'overflow-x-auto w-full' : 'w-full',
      infiniteScroll && 'max-h-[600px] overflow-y-auto'
    )

    const tableClass = scrollable ? 'min-w-full border-collapse' : 'w-full border-collapse'

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

const TableBody: React.FC<TableBodyProps> = ({ children, className, testId = 'table-body' }) => {
  return (
    <tbody className={className} data-testid={testId}>
      {children}
    </tbody>
  )
}

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
