import { User, USER_ROLES } from '@/entities/user';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Админ',
    lastName: 'Админович',
    role: USER_ROLES.admin,
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: '2',
    email: 'tutor@example.com',
    firstName: 'Иван',
    lastName: 'Преподавателев',
    role: USER_ROLES.tutor,
    avatar: 'https://i.pravatar.cc/150?u=tutor'
  },
  {
    id: '3',
    email: 'student@example.com',
    firstName: 'Студент',
    lastName: 'Студентов',
    role: USER_ROLES.student,
    avatar: 'https://i.pravatar.cc/150?u=student'
  }
];

// Эмуляция задержки для имитации сетевых запросов
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));