import { z } from "zod";

export const branchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Branch name must be at least 2 characters")
    .max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(20),

  address: z
    .string()
    .trim()
    .min(5)
    .max(255),

  city: z
    .string()
    .trim()
    .min(2)
    .max(100),

  state: z
    .string()
    .trim()
    .min(2)
    .max(100),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100),

  latitude: z
    .number()
    .nullable()
    .optional(),

  longitude: z
    .number()
    .nullable()
    .optional(),

  phone: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional(),

  email: z
    .string()
    .email("Invalid email")
    .nullable()
    .optional(),

  openingHours: z
    .string()
    .trim()
    .min(2)
    .max(100),

  pickupAvailable: z.boolean(),

  isMainBranch: z.boolean(),
});

export type BranchFormData = z.infer<typeof branchSchema>;