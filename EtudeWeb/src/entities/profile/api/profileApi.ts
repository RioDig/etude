import axios from 'axios'
import { API_URL } from '@/shared/config'
import { Competency, PastEvent } from '@/shared/types'
import { delay, MOCK_COMPETENCIES, MOCK_PAST_EVENTS } from '@/entities/profile/api/mockData'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const profileApi = {
  getUserCompetencies: async (): Promise<Competency[]> => {
    try {
      const { data } = await api.get<Competency[]>('/UserStatistics/competencies')
      return data
    } catch (error) {
      console.error('Error fetching user competencies:', error)
      await delay(800)
      return MOCK_COMPETENCIES
    }
  },

  getUserPastEvents: async (): Promise<PastEvent[]> => {
    try {
      // const { data } = await api.get<PastEvent[]>('/UserStatistics/pastEvents')
      return MOCK_PAST_EVENTS
    } catch (error) {
      console.error('Error fetching user past events:', error)
      await delay(1000)
      return MOCK_PAST_EVENTS
    }
  }
}
