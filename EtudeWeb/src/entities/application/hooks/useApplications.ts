import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApplicationsStore } from '../model/applicationsStore';
import { applicationsApi } from '../api/applicationsApi';

export const useApplications = () => {
  const queryClient = useQueryClient();
  const filters = useApplicationsStore((state) => state.filters);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', filters],
    queryFn: () => applicationsApi.getApplications(filters),
  });

  const createMutation = useMutation({
    mutationFn: applicationsApi.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      applicationsApi.updateApplication(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  return {
    applications,
    isLoading,
    createApplication: createMutation.mutate,
    updateApplication: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
};