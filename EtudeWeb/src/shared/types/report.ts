export enum ReportType {
  CompletedTraining = 'CompletedTraining'
}

/**
 * Интерфейс для отчета
 */
export interface Report {
  /**
   * Идентификатор отчета
   */
  report_id: string

  /**
   * Тип отчета
   */
  report_type: ReportType

  /**
   * Дата создания отчета
   */
  report_createDate: string
}

/**
 * Параметр фильтра для запросов отчетов
 */
export interface ReportFilterParam {
  /**
   * Название фильтра (filter_type, date)
   */
  name: 'filter_type' | 'date'

  /**
   * Значение фильтра
   */
  value: string
}
