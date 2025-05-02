// src/entities/user/model/types.ts (обновленная версия)
export type UserRole = 'admin' | 'tutor' | 'student' | 'guest'

export interface User {
  id: string
  orgEmail: string
  name: string
  surname: string
  role: UserRole
  avatar?: string
  position?: string // Должность
  department?: string // Отдел или группа
}
