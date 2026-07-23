export type BranchStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE";

export interface Branch {
  id: string;

  name: string;

  code: string;

  address: string;

  city: string;

  state: string;

  country: string;

  latitude: number | null;

  longitude: number | null;

  phone: string | null;

  email: string | null;

  openingHours: string;

  pickupAvailable: boolean;

  isMainBranch: boolean;

  status: BranchStatus;

  createdAt: string;

  updatedAt: string;
}