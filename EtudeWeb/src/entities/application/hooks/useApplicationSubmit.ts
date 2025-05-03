// src/entities/application/hooks/useApplicationSubmit.ts
import { useMutation } from '@tanstack/react-query'
import { applicationApi } from '../api/applicationApi'
import { ApplicationData } from '@/entities/application'

export const useApplicationSubmit = () => {
  return useMutation({
    mutationFn: (data: ApplicationData) => applicationApi.createApplication(data),
    onSuccess: (data) => {
      // Здесь можно добавить логику обработки успешного создания заявления
      console.log('Заявление успешно создано:', data)
    },
    onError: (error) => {
      console.error('Ошибка при создании заявления:', error)
    }
  })
}
