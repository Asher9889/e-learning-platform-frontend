export interface UserData {
    id: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export type UserRole = "admin" | "instructor" | "student";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}