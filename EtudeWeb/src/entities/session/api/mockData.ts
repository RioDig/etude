import { User, USER_ROLES } from '@/entities/user';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    orgEmail: 'admin@example.com',
    name: 'Админ',
    surname: 'Админович',
    role: USER_ROLES.admin,
    avatar: 'https://i.pravatar.cc/150?u=admin'
  },
  {
    id: '2',
    orgEmail: 'tutor@example.com',
    name: 'Иван',
    surname: 'Преподавателев',
    role: USER_ROLES.tutor,
    avatar: 'https://i.pravatar.cc/150?u=tutor'
  },
  {
    id: '3',
    orgEmail: 'student@example.com',
    name: 'Студент',
    surname: 'Студентов',
    role: USER_ROLES.student,
    avatar: 'https://i.pravatar.cc/150?u=student'
  }
];

// Эмуляция задержки для имитации сетевых запросов
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));