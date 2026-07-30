export type PointCoordinates = [number, number]; // [Longitude, Latitude]

export interface LogisticsPoint {
  name: string;
  coordinates: PointCoordinates;
}

export const LOGISTICS_POINTS: Record<"kampala" | "nimule" | "juba" | "customer", LogisticsPoint> = {
  kampala: {
    name: "Kampala Warehouse",
    coordinates: [32.5825, 0.3476],
  },

  nimule: {
    name: "Nimule Border",
    coordinates: [32.0517, 3.6012],
  },

  juba: {
    name: "Juba Warehouse",
    coordinates: [31.5713, 4.8594],
  },

  customer: {
    name: "Customer",
    // Offset slightly east so it doesn't overlap Juba
    coordinates: [31.85, 4.95],
  },
};

/**
 * High-resolution highway points tracing the real A109 / A43 road corridor
 * Coordinates format: [Longitude, Latitude]
 */
export const LOGISTICS_ROUTE: PointCoordinates[] = [
  // Kampala Hub
  LOGISTICS_POINTS.kampala.coordinates,

  // A109 Highway North via Luweero & Nakasongola
  [32.4991, 0.8491],
  [32.4563, 1.3089],

  // Karuma Falls Bridge Crossing
  [32.2472, 2.2384],

  // Gulu Transit Node
  [32.2990, 2.7747],

  // Atiak Highway Segment
  [32.1224, 3.2581],

  // Nimule Border Control Point
  LOGISTICS_POINTS.nimule.coordinates,

  // Nimule - Juba Road (A43 Corridor)
  [31.8902, 3.9851],
  [31.7345, 4.3129],

  // Juba City Warehouse
  LOGISTICS_POINTS.juba.coordinates,

  // Final Mile Delivery to Customer
  LOGISTICS_POINTS.customer.coordinates,
];