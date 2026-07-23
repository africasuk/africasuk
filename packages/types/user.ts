export interface User {
  id: string;
  userId: string;

  fullName: string;

  email: string;

  phone: string | null;

  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "STAFF";

  isActive: boolean;

  mustChangePassword: boolean;

  createdAt: string;

  updatedAt: string;
}