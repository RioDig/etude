// src/entities/employee/hooks/useEmployees.ts
import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employeeApi'

export const useEmployees = (excludeIds: string[] = []) => {
  return useQuery({
    queryKey: ['employees', { excludeIds }],
    queryFn: () => employeeApi.getEmployees(excludeIds),
    staleTime: 1000 * 60 * 5 // данные считаются свежими 5 минут
  })
}

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: !!id, // запрос активируется только при наличии id
    staleTime: 1000 * 60 * 5
  })
}
