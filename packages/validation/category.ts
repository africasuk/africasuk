import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(100, "Category name must not exceed 100 characters."),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),

  imageUrl: z
    .union([
      z.string().url("Invalid image URL."),
      z.literal(""),
    ])
    .nullable()
    .optional(),

  parentId: z
    .union([
      z.string().uuid(),
      z.literal("none"),
      z.literal(""),
    ])
    .nullable()
    .optional(),

  level: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),

  isActive: z
    .boolean()
    .default(true),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export type CategoryFormData = z.infer<
  typeof categorySchema
>;