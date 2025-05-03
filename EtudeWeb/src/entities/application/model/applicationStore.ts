import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ApplicationEvent {
  id: string
  title: string
  description?: string
  type: string
  format: string
  category: string
  startDate: Date
  endDate: Date
}

export interface ApplicationData {
  // О мероприятии (Шаг 1)
  type?: string
  title?: string
  category?: string
  format?: string
  link?: string
  description?: string

  // О проведении (Шаг 2)
  duration?: string
  goal?: string
  cost?: string
  participants?: string[]

  // Согласующие (Шаг 3)
  approvers?: Array<{
    id: string
    userId: string
  }>

  // Системные поля
  id?: string
  status?: 'draft' | 'pending' | 'approved' | 'rejected'
  createdAt?: string
  updatedAt?: string
}

interface ApplicationState {
  activeStep: number
  currentApplication: ApplicationData | null
  selectedEventId: string | null

  // Действия
  setActiveStep: (step: number) => void
  selectEvent: (eventId: string) => void
  updateApplicationData: (data: Partial<ApplicationData>) => void
  reset: () => void
}

// Создаем хранилище состояния заявления
export const useApplicationStore = create<ApplicationState>()(
  devtools(
    (set) => ({
      activeStep: 0,
      currentApplication: null,
      selectedEventId: null,

      // Установка активного шага
      setActiveStep: (step) => set({ activeStep: step }),

      // Выбор мероприятия из каталога
      selectEvent: (eventId) => set({ selectedEventId: eventId }),

      // Обновление данных заявления
      updateApplicationData: (data) =>
        set((state) => ({
          currentApplication: {
            ...(state.currentApplication || {}),
            ...data
          }
        })),

      // Сброс данных заявления
      reset: () =>
        set({
          activeStep: 0,
          currentApplication: null,
          selectedEventId: null
        })
    }),
    { name: 'application-store' }
  )
)
