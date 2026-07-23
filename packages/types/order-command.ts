export interface PlaceOrderItem {
  productId: string;
  variantId: string;

  quantity: number;
}

export interface PlaceOrderCustomer {
  name: string;
  email: string;
  phone?: string;

  country: string;
  state?: string;
  city: string;
  address: string;
  postalCode?: string;

  notes?: string;
}

export interface PlaceOrderRequest {
  userId?: string;

  customer: PlaceOrderCustomer;

  items: PlaceOrderItem[];

  paymentMethod: string;

  currency: string;
}