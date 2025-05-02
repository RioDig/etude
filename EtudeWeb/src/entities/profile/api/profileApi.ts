// src/entities/profile/api/profileApi.ts
import axios from 'axios'
import { API_URL } from '@/shared/config'

// Интерфейсы для API
export interface Competency {
  id: string
  name: string
}

export interface PastEvent {
  id: string
  name: string
  type: string
  format: string
  direction: string
  start_date: string
  end_date: string
}

// Создаем инстанс axios для работы с бэкендом
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const profileApi = {
  // Получение компетенций пользователя
  getUserCompetencies: async (): Promise<Competency[]> => {
    // const { data } = await api.get<Competency[]>('/user/competencies') //TODO: расскомментировать
    return [
      {
        id: '1',
        name: 'Управление командой'
      },
      {
        id: '2',
        name: 'C#'
      },
      {
        id: '3',
        name: 'Базы данных'
      },
      {
        id: '4',
        name: 'Алгоритмы'
      },
      {
        id: '5',
        name: 'Soft Skills'
      },
    ]
    // return data
  },

  // Получение прошедших мероприятий пользователя
  getUserPastEvents: async (): Promise<PastEvent[]> => {
    // const { data } = await api.get<PastEvent[]>('/user/past-events') //TODO: расскомментить после реализации
    let data = [
      {
        id: "1",
        name: 'Senior Backend C# Разработчик',
        type: 'Онлайн-курс',
        format: 'Онлайн',
        direction: 'Hard Skills',
        start_date: '',
        end_date: ''
      },
    ]
    return data
  }
}
