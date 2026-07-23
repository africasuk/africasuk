export type SupplierStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED";

export interface Supplier {
  id: string;

  companyName: string;

  contactName: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  country: string;

  logoUrl: string | null;

  website: string | null;

  taxNumber: string | null;

  status: SupplierStatus;

  createdAt: string;

  updatedAt: string;
}