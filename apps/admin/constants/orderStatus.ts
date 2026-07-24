import type { OrderStatus } from "@africasuk/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  READY_FOR_PICKUP: "Ready for Pickup",
  IN_TRANSIT: "In Transit",
  AT_BORDER: "At Border",
  AT_JUBA_WAREHOUSE: "At Juba Warehouse",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-zinc-500",
  CONFIRMED: "bg-blue-500",
  PROCESSING: "bg-indigo-500",
  READY_FOR_PICKUP: "bg-cyan-500",
  IN_TRANSIT: "bg-orange-500",
  AT_BORDER: "bg-yellow-500",
  AT_JUBA_WAREHOUSE: "bg-emerald-500",
  OUT_FOR_DELIVERY: "bg-purple-500",
  DELIVERED: "bg-green-600",
  CANCELLED: "bg-red-600",
};