import { User } from '@/shared/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SessionState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  initialized: boolean
}
