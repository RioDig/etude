import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseTemplateApi } from '../api/courseTemplateApi'
import { CourseTemplate } from '@/shared/types'
import { usePageFilters } from '@/entities/filter'

export const useCourseTemplates = () => {
  const { filters } = usePageFilters('admin-templates')

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
    queryKey: ['courseTemplates', apiFilters],
    // @ts-expect-error hotfix
    queryFn: () => courseTemplateApi.getCourseTemplates(apiFilters),
    staleTime: 1000 * 60 * 5 // Данные считаются свежими 5 минут
  })
}

export const useCourseTemplate = (id?: string) => {
  return useQuery({
    queryKey: ['courseTemplate', id],
    queryFn: () => courseTemplateApi.getCourseTemplateById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateCourseTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateData: Omit<CourseTemplate, 'course_template_id'>) =>
      courseTemplateApi.createCourseTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseTemplates'] })
    }
  })
}

export const useUpdateCourseTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateData: CourseTemplate) =>
      courseTemplateApi.updateCourseTemplate(templateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courseTemplates'] })
      queryClient.invalidateQueries({ queryKey: ['courseTemplate', data.course_template_id] })
    }
  })
}

export const useDeleteCourseTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => courseTemplateApi.deleteCourseTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseTemplates'] })
    }
  })
}
