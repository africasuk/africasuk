export const LOGISTICS_POINTS = {
  nairobi: {
    name: "Nairobi Warehouse",
    coordinates: [36.8219, -1.2921] as [number, number],
  },

  nimule: {
    name: "Nimule Border",
    coordinates: [32.0517, 3.6012] as [number, number],
  },

  juba: {
    name: "Juba Warehouse",
    coordinates: [31.5713, 4.8594] as [number, number],
  },

  customer: {
    name: "Customer",
    // Offset slightly east so it doesn't overlap Juba
    coordinates: [31.85, 4.95] as [number, number],
  },
};

// Nairobi → Nimule → Juba → Customer
export const LOGISTICS_ROUTE: [number, number][] = [
  // Nairobi Hub
  LOGISTICS_POINTS.nairobi.coordinates,

  // Nairobi → Northern Kenya
  [36.75, -1.05],
  [36.65, -0.75],
  [36.55, -0.40],
  [36.45, -0.05],

  // Kenya → Uganda/South Sudan corridor
  [36.30, 0.35],
  [36.05, 0.75],
  [35.80, 1.15],
  [35.50, 1.55],
  [35.20, 1.95],

  // Northern Uganda / South Sudan approach
  [34.90, 2.35],
  [34.50, 2.70],
  [34.10, 2.95],
  [33.70, 3.15],
  [33.30, 3.35],

  // Nimule Border
  LOGISTICS_POINTS.nimule.coordinates,

  // Nimule → Juba
  [31.8902, 3.9851],
  [31.7345, 4.3129],

  // Juba Warehouse
  LOGISTICS_POINTS.juba.coordinates,

  // Final Mile Delivery
  LOGISTICS_POINTS.customer.coordinates,
];