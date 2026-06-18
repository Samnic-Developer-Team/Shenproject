import type { Role } from '../../constants/roles';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role?: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
