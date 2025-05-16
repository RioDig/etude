import { useQuery, useMutation } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'
import { ReportFilterParam } from '@/shared/types'
import { usePageFilters } from '@/entities/filter'

export const useReports = () => {
  const { filters } = usePageFilters('admin-reports')

  const apiFilters = Object.entries(filters).reduce((result: ReportFilterParam[], [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      result.push(<ReportFilterParam>{ name: key, value: String(value) })
    }
    return result
  }, [])

  return useQuery({
    queryKey: ['reports', apiFilters],
    queryFn: () => reportApi.getReports(apiFilters),
    staleTime: 1000 * 60 * 5
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (id: string) => reportApi.downloadReport(id),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  })
}

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: reportApi.generateReport,
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `generated_report_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  })
}
