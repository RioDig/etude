import { Report, ReportType } from '@/shared/types'

export const MOCK_REPORTS: Report[] = [
  {
    report_id: '1',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-05-15T14:30:00Z'
  },
  {
    report_id: '2',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-05-14T09:45:00Z'
  },
  {
    report_id: '3',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-05-13T16:20:00Z'
  },
  {
    report_id: '4',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-05-10T11:15:00Z'
  },
  {
    report_id: '5',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-05-05T13:40:00Z'
  },
  {
    report_id: '6',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-04-30T10:10:00Z'
  },
  {
    report_id: '7',
    report_type: ReportType.CompletedTraining,
    report_createDate: '2025-04-25T15:05:00Z'
  }
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
