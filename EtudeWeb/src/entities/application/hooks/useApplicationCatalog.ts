import { useQuery } from '@tanstack/react-query'
import { courseTemplateApi } from '@/entities/courseTemplate/api/courseTemplateApi'
import { usePageFilters } from '@/entities/filter'

/**
 * Хук для получения данных каталога шаблонов курсов с учетом фильтрации
 */
export const useApplicationCatalog = () => {
  const { filters } = usePageFilters('application-catalog')

  const apiFilters = Object.entries(filters).reduce(
    (result, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = String(value)
      }
      return result
    },
    {} as Record<string, string>
  )

  return useQuery({
    queryKey: ['courseTemplates', 'catalog', apiFilters],
    // @ts-expect-error hotfix
    queryFn: () => courseTemplateApi.getCourseTemplates(apiFilters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 5,
    refetchOnWindowFocus: false
  })
}

/**
 * Хук для получения данных шаблона курса по ID
 */
export const useApplicationTemplate = (templateId: string | null) => {
  return useQuery({
    queryKey: ['courseTemplate', templateId],
    queryFn: () => courseTemplateApi.getCourseTemplateById(templateId!),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })
}
