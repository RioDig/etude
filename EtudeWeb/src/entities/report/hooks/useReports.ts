import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'
import { usePageFilters } from '@/entities/filter'
import { formatDate } from '@/shared/utils/formatDate.ts'

export const useReports = () => {
  const { filters } = usePageFilters('admin-reports')

  const apiFilters = Object.entries(filters).reduce(
    (result, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value instanceof Date ? formatDate(value) : String(value)
      }
      return result
    },
    {} as Record<string, string>
  )

  return useQuery({
    queryKey: ['reports', apiFilters],
    // @ts-expect-error hotfix
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reportApi.generateReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
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
