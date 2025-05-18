import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationApi } from '../api/applicationApi'
import { ApplicationCreateData } from '@/shared/types/applicationCreate'
import { ApplicationData } from '@/entities/application'

export const useApplicationSubmit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicationData: ApplicationData) => {
      const createData: ApplicationCreateData = {
        name: applicationData.name || '',
        description: applicationData.description,
        type: applicationData.type!,
        track: applicationData.track!,
        format: applicationData.format!,
        trainingCenter: applicationData.trainingCenter,
        startDate: applicationData.startDate || new Date().toISOString(),
        endDate: applicationData.endDate || new Date().toISOString(),
        link: applicationData.link,
        price: applicationData.price,
        educationGoal: applicationData.educationGoal,
        learner_id: applicationData.learner_id || '1',
        author_id: applicationData.learner_id || '1',
        approvers: applicationData.approvers?.map((a) => a.user_id)
      }
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      return applicationApi.createApplication(createData)
    }
  })
}
