// packages/types/order-tracking.ts

export const ORDER_TRACKING = [
  {
    status: "PENDING",
    title: "Order Placed",
    location: "AfricaSuk",
  },
  {
    status: "CONFIRMED",
    title: "Order Confirmed",
    location: "AfricaSuk",
  },
  {
    status: "PROCESSING",
    title: "Supplier Preparing Order",
    location: "Kampala, Uganda",
  },
  {
    status: "READY_FOR_PICKUP",
    title: "Ready for Pickup",
    location: "Kampala, Uganda",
  },
  {
    status: "IN_TRANSIT",
    title: "On the Way",
    location: "Kampala → Nimule",
  },
  {
    status: "AT_BORDER",
    title: "Reached Border",
    location: "Nimule Border",
  },
  {
    status: "AT_JUBA_WAREHOUSE",
    title: "Arrived at Warehouse",
    location: "Juba Warehouse",
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    location: "Juba",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    location: "Customer Address",
  },
] as const;