import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customStatusApi } from '../api/customStatusApi'
import { CustomStatus } from '@/shared/types'

export const useCustomStatuses = () => {
  return useQuery({
    queryKey: ['customStatuses'],
    queryFn: customStatusApi.getCustomStatuses,
    staleTime: 1000 * 60 * 5
  })
}

export const useCustomStatus = (id?: string) => {
  return useQuery({
    queryKey: ['customStatus', id],
    queryFn: () => customStatusApi.getCustomStatusById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateCustomStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statusData: Omit<CustomStatus, 'id'>) =>
      customStatusApi.createCustomStatus(statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customStatuses'] })
    }
  })
}

export const useUpdateCustomStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<CustomStatus, 'id'> }) =>
      customStatusApi.updateCustomStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customStatuses'] })
      queryClient.invalidateQueries({ queryKey: ['customStatus', variables.id] })
    }
  })
}

export const useDeleteCustomStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customStatusApi.deleteCustomStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customStatuses'] })
    }
  })
}
