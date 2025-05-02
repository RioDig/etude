// src/entities/profile/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profileApi'

export const useUserCompetencies = () => {
  return useQuery({
    queryKey: ['userCompetencies'],
    queryFn: profileApi.getUserCompetencies,
    staleTime: 1000 * 60 * 15, // 15 минут
    gcTime: 1000 * 60 * 60 // 1 час
  })
}

export const useUserPastEvents = () => {
  return useQuery({
    queryKey: ['userPastEvents'],
    queryFn: profileApi.getUserPastEvents,
    staleTime: 1000 * 60 * 15, // 15 минут
    gcTime: 1000 * 60 * 60 // 1 час
  })
}
