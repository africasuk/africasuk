import type { OrderStatus } from "./order";

import { ORDER_TRACKING } from "./order-tracking";


export function getTrackingStep(status: OrderStatus) {
  return ORDER_TRACKING.findIndex(
    (step) => step.status === status,
  );
}