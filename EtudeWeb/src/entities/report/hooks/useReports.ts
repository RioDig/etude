import { useQuery, useMutation } from '@tanstack/react-query'
import { reportApi } from '../api/reportApi'
import { usePageFilters } from '@/entities/filter'

export const useReports = () => {
  const { filters } = usePageFilters('admin-reports')

  // Преобразуем фильтры в формат, подходящий для API
  const apiFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  return useQuery({
    queryKey: ['reports', apiFilters],
    queryFn: () => reportApi.getReports(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (id: string) => reportApi.downloadReport(id)
  })
}