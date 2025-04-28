export type UserRole = 'admin' | 'tutor' | 'student' | 'guest';

export interface User {
  id: string;
  orgEmail: string;
  name: string;
  surname: string;
  role: UserRole;
  avatar?: string;
}