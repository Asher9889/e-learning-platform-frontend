export interface UserData {
    id: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export type UserRole = "admin" | "teacher" | "student";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}