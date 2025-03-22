import axios from 'axios';
import { Application } from '../model/types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const applicationsApi = {
  getApplications: async (filters?: never): Promise<Application[]> => {
    const { data } = await api.get('/applications', { params: filters });
    return data;
  },

  createApplication: async (applicationData: Partial<Application>): Promise<Application> => {
    const { data } = await api.post('/applications', applicationData);
    return data;
  },

  updateApplication: async (id: string, updates: Partial<Application>): Promise<Application> => {
    const { data } = await api.patch(`/applications/${id}`, updates);
    return data;
  },
};