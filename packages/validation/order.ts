import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().uuid(),

  quantity: z
    .number()
    .int()
    .positive("Quantity must be at least 1"),
});

export const orderSchema = z.object({
  branchId: z.string().uuid(),

  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one product"),

  fulfillmentMethod: z.enum([
    "PICKUP",
    "DELIVERY",
  ]),

  paymentMethod: z.enum([
    "CASH",
    "CARD",
    "MOBILE_MONEY",
    "BANK_TRANSFER",
  ]),

  notes: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),
});

export type OrderItemFormData = z.infer<
  typeof orderItemSchema
>;

export type OrderFormData = z.infer<
  typeof orderSchema
>;