export type AuthProvider =
  | "email"
  | "google";

export interface AuthUser {
  id: string;

  email: string;

  fullName: string;

  avatarUrl: string | null;

  provider: AuthProvider;
}

export interface Session {
  accessToken: string;

  refreshToken: string;

  expiresAt: number;
}