export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_PICKUP"
  | "IN_TRANSIT"
  | "AT_BORDER"
  | "AT_JUBA_WAREHOUSE"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface Order {
  id: string;

  userId: string | null;

  orderNumber: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  paymentMethod: string | null;

  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;

  currency: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string | null;

  country: string;
  state: string | null;
  city: string;
  address: string;
  postalCode: string | null;

  notes: string | null;

  estimatedDeliveryStart: string | null;
  estimatedDeliveryEnd: string | null;
  estimatedDeliveryUpdatedAt: string | null;

  trackingNumber: string | null;
  adminNotes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;

  orderId: string;

  productId: string;
  variantId: string;

  name: string;
  image: string | null;

  price: number;
  quantity: number;

  createdAt: string;
}