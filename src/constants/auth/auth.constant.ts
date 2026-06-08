import type { IUserState } from "../user/user.constant";

export const AUTH_STATUS = {
  CHECKING: "CHECKING",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  AUTHENTICATED: "AUTHENTICATED",
} as const;

export type TAuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface IAuthState {
  user: IUserState | null;
  status: TAuthStatus;
}