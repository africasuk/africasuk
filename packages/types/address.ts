export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  country: string;
  state: string | null;
  city: string;
  area: string | null;
  street: string;
  building: string | null;
  apartment: string | null;
  landmark: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  country: string;
  state?: string | null;
  city: string;
  area?: string | null;
  street: string;
  building?: string | null;
  apartment?: string | null;
  landmark?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

export interface UpdateAddressDto
  extends Partial<Omit<CreateAddressDto, "userId">> {}