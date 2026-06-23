import { apiRequest } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SELLER" | "ADMIN";
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>("/auth/login", {
    method: "POST",
    bodyData: { email, password },
  });
  return res.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: "USER" | "SELLER" = "USER"
): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>("/auth/register", {
    method: "POST",
    bodyData: { name, email, password, role },
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiRequest("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiRequest<{ data: AuthUser }>("/auth/me");
  return res.data;
}
