import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CourseType, CourseTrack, CourseFormat, StatusType } from '@/shared/types'
import { Employee } from '@/shared/api/employeeAutocomplete'

export interface Approver {
  id: string
  user_id: string
  employeeData?: Employee
}

export interface ApplicationData {
  name?: string
  description?: string
  type?: CourseType
  track?: CourseTrack
  format?: CourseFormat
  link?: string

  startDate?: string
  endDate?: string
  educationGoal?: string
  price?: string
  trainingCenter?: string
  learner_id?: string

  approvers?: Approver[]

  id?: string
  status?: StatusType
  createdAt?: string
  updatedAt?: string
}

interface ApplicationState {
  activeStep: number
  currentApplication: ApplicationData | null
  selectedTemplateId: string | null

  setActiveStep: (step: number) => void
  selectTemplate: (templateId: string) => void
  updateApplicationData: (data: Partial<ApplicationData>) => void
  reset: () => void
}

export const useApplicationStore = create<ApplicationState>()(
  devtools(
    (set) => ({
      activeStep: 0,
      currentApplication: null,
      selectedTemplateId: null,

      setActiveStep: (step) => set({ activeStep: step }),

      selectTemplate: (templateId) => set({ selectedTemplateId: templateId }),

      updateApplicationData: (data) =>
        set((state) => ({
          currentApplication: {
            ...(state.currentApplication || {}),
            ...data
          }
        })),

      reset: () =>
        set({
          activeStep: 0,
          currentApplication: null,
          selectedTemplateId: null
        })
    }),
    { name: 'application-store' }
  )
)
