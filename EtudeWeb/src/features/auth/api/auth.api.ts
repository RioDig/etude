import { baseApi } from '@/shared/api';
import { LoginDTO, RegisterDTO, User } from '../model/types';

export const authApi = {
  login: (data: LoginDTO) =>
    baseApi.post<User>('/auth/login', data),

  register: (data: RegisterDTO) =>
    baseApi.post<User>('/auth/register', data),

  logout: () =>
    baseApi.post('/auth/logout'),

  getProfile: () =>
    baseApi.get<User>('/auth/me'),
};