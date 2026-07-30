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
    | "STAFF"
    | "CUSTOMER";

  isActive: boolean;

  mustChangePassword: boolean;

  createdAt: string;

  updatedAt: string;
}