import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { LoginCredentials, RegisterData } from '../model/types'
import { API_URL } from '@/shared/config'
import { User } from '@/shared/types'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await api.post('/auth/refresh-token')

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const sessionApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    await api.post('/auth/email-login', credentials)

    return sessionApi.getCurrentUser()
  },

  register: async (data: RegisterData): Promise<User> => {
    await api.post('/auth/register', data)

    return sessionApi.getCurrentUser()
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/user/me')
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  refreshToken: async (): Promise<void> => {
    await api.post('/auth/refresh-token')
  }
}
