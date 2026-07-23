import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Brand name must be at least 2 characters"
    )
    .max(100),

  slug: z
    .string()
    .trim()
    .max(100)
    .optional(),

  logoUrl: z
    .string()
    .url("Invalid logo URL")
    .nullable()
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),

  website: z
    .union([
      z.string().url("Invalid website URL"),
      z.literal(""),
    ])
    .nullable()
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

export type BrandFormData = z.infer<
  typeof brandSchema
>;