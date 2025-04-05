import { UserRole } from './types';

export const USER_ROLES: Record<UserRole, UserRole> = {
  admin: 'admin',
  tutor: 'tutor',
  student: 'student',
  guest: 'guest'
};

export const USER_ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Администратор',
  tutor: 'Преподаватель',
  student: 'Студент',
  guest: 'Гость'
};