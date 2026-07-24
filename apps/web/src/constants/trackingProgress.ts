import type { OrderStatus } from "@africasuk/types";

export const COMPLETED_SEGMENTS: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 0,
  PROCESSING: 0,

  READY_FOR_PICKUP: 1,

  IN_TRANSIT: 1,

  AT_BORDER: 2,

  AT_JUBA_WAREHOUSE: 3,

  OUT_FOR_DELIVERY: 3,

  DELIVERED: 4,

  CANCELLED: 0,
};