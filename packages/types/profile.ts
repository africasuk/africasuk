export type UserRole =
  | "CUSTOMER"
  | "ADMIN"
  | "SUPPLIER"
  | "WAREHOUSE"
  | "BRANCH_MANAGER"
  | "DELIVERY"
  | "SUPPORT";

export type Language = "en" | "ar";

export interface Profile {
  id: string;
  userId: string;

  fullName: string;
  email: string;
  phone: string | null;

  avatarUrl: string | null;

  role: UserRole;

  language: Language;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}