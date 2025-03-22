import axios from 'axios';
import { User } from '../model/types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const sessionApi = {
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};