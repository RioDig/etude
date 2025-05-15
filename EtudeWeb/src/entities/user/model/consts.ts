import { UserRole } from '@/shared/types'

export const USER_ROLES: Record<UserRole, UserRole> = {
  admin: 'admin',
  user: 'user'
}

export const USER_ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Администратор',
  user: 'Пользователь'
}
