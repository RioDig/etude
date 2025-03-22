export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

export interface SessionStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}