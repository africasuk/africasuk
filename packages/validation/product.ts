import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(200, "Product name must not exceed 200 characters."),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .nullable()
    .optional(),

  sku: z
    .string()
    .trim()
    .nullable()
    .optional(),

  barcode: z
    .string()
    .trim()
    .nullable()
    .optional(),

  brandId: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  categoryId: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  supplierId: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  branchId: z
    .string()
    .uuid()
    .nullable()
    .optional(),

  price: z
    .number()
    .nonnegative("Price cannot be negative."),

  currency: z
    .string()
    .trim()
    .default("SSP"),

  stock: z
    .number()
    .int()
    .min(0),

  

  featured: z
    .boolean()
    .default(false),

  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "OUT_OF_STOCK",
  ]),

  images: z
  .array(z.string().url())
  .max(6)
  .default([]),
});

export type ProductFormData = z.infer<
  typeof productSchema
>;