import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profileApi'
import { Competency, PastEvent } from '@/shared/types'

export const useUserCompetencies = () => {
  return useQuery<Competency[], Error>({
    queryKey: ['userCompetencies'],
    queryFn: profileApi.getUserCompetencies,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 2
  })
}

export const useUserPastEvents = () => {
  return useQuery<PastEvent[], Error>({
    queryKey: ['userPastEvents'],
    queryFn: profileApi.getUserPastEvents,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 2
  })
}
